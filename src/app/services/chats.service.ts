import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UsersService } from '.';
import { AuthenticationService } from './authentication.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService,
    private router: Router,
    private http: HttpClient,
    private usersService: UsersService,
    private zone: NgZone
  ) {}

  get(chatId) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  getUserChats() {
    return this.auth.user$.pipe(
      switchMap((user) => {
        return this.afs
          .collection('chats', (ref) => ref.where('uid', '==', user.uid))
          .snapshotChanges()
          .pipe(
            map((actions) => {
              return actions.map((a) => {
                const data: Object = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })
          );
      })
    );
  }

  getAllChats() {
    return this.afs
      .collection('chats')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  async create() {
    await this.auth.afAuth.authState.subscribe(async (user) => {
      const data = {
        uid: user.uid,
        displayName: user.displayName,
        createdAt: Date.now(),
        count: 0,
        messages: [],
      };

      const docRef = await this.afs.collection('chats').add(data);

      return this.router.navigate(['messages/chat', docRef.id]);
    });
  }

  /**
   * Opens (or creates) a 1-to-1 private chat between the current admin/counsellor
   * and the given client, then navigates to it. The chat is written in the schema
   * the mobile app reads (`uids` array + `type: 'private'`) so messages are
   * delivered to the client's app.
   */
  async openChatWithUser(user: any) {
    const stored = JSON.parse(sessionStorage.getItem('user') || 'null');
    const adminUid = this.auth.user?.uid || stored?.uid;
    const clientUid = user?.uid;

    if (!adminUid || !clientUid || adminUid === clientUid) {
      console.warn('openChatWithUser: missing/invalid uids', { adminUid, clientUid });
      return;
    }

    const name = user.displayName || user.email || 'Client';
    let chatId: string | null = null;

    try {
      // Read all chats (same read the Messages page uses) and match in memory,
      // so we avoid index/permission edge-cases on filtered queries.
      const snap = await this.afs.collection('chats').get().toPromise();

      const match = snap?.docs.find((doc) => {
        const c: any = doc.data();
        if (c?.type === 'group') {
          return false;
        }
        const uids: any[] = Array.isArray(c?.uids) ? c.uids : [];
        const linkedByUids = uids.includes(adminUid) && uids.includes(clientUid);
        const legacyClientOwned = !uids.length && c?.uid === clientUid;
        const legacyAdminOwned =
          !uids.length && c?.uid === adminUid && c?.recipientId === clientUid;
        return linkedByUids || legacyClientOwned || legacyAdminOwned;
      });

      if (match) {
        chatId = match.id;
        const data: any = match.data();
        const uids: any[] = Array.isArray(data?.uids) ? data.uids : [];
        // Migrate legacy chats so the mobile app (which queries by `uids`) sees them.
        if (!uids.includes(adminUid) || !uids.includes(clientUid) || data?.type !== 'private') {
          await this.afs
            .collection('chats')
            .doc(chatId)
            .set(
              {
                uids: Array.from(new Set([...uids, adminUid, clientUid])),
                type: 'private',
                recipientName: data?.recipientName || name,
                displayName: data?.displayName || name,
              },
              { merge: true }
            )
            .catch((err) => console.error('Failed to migrate chat uids', err));
        }
      } else {
        const data = {
          uid: adminUid,
          uids: [adminUid, clientUid],
          displayName: name,
          recipientName: name,
          type: 'private',
          createdAt: Date.now(),
          count: 0,
          messages: [],
        };
        const docRef = await this.afs.collection('chats').add(data);
        chatId = docRef.id;
      }
    } catch (err) {
      console.error('Failed to open chat with user', err);
      return;
    }

    if (chatId) {
      await this.zone.run(() => this.router.navigate(['/messages/chats', chatId]));
    }
  }

  markRead(chatId: string, uid: string, count: number) {
    if (!chatId || !uid) {
      return Promise.resolve();
    }
    return this.afs
      .collection('chats')
      .doc(chatId)
      .update({ [`hasRead.${uid}`]: count })
      .catch(() => {});
  }

  async sendMessage(chatId, content, chatUser?: string, members?: string[]) {
    const uid = JSON.parse(sessionStorage.getItem('user'))?.uid;

    const data = {
      uid,
      content,
      createdAt: Date.now(),
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);

      if (chatUser && chatUser !== uid) {
        this.sendPush(chatId, data, chatUser);
      }

      if (members) {
        members.forEach((chatUser) => {
          if (chatUser && chatUser !== uid) {
            this.sendPush(chatId, data, chatUser);
          }
        });
      }

      const update: any = {
        messages: firebase.firestore.FieldValue.arrayUnion(data),
      };

      // For 1-to-1 chats, make sure the doc is discoverable by the mobile app,
      // which lists chats via `uids array-contains <userId>`. arrayUnion is
      // idempotent, so this safely migrates legacy chats that lack `uids`.
      if (!members && chatUser && chatUser !== uid) {
        update.uids = firebase.firestore.FieldValue.arrayUnion(uid, chatUser);
        update.type = 'private';
      }

      return ref.update(update);
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap((c) => {
        // Unique User IDs
        chat = c || {};
        chat.messages = Array.isArray(chat.messages) ? chat.messages : [];
        const uids = Array.from(new Set(chat.messages.map((v) => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map((u) =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map((arr) => {
        arr.forEach((v) => (joinKeys[(<any>v)?.uid] = v));
        chat.messages = chat.messages.map((v) => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }

  async deleteMessage(chat, msg) {
    const uid = JSON.parse(sessionStorage.getItem('user'))?.uid;

    const ref = this.afs.collection('chats').doc(chat.id);

    if (chat.uid === uid || msg.uid === uid) {
      // Allowed to delete
      delete msg.user;
      return ref.update({
        messages: firebase.firestore.FieldValue.arrayRemove(msg),
      });
    }
  }

  createGroup(data) {
    return this.afs.collection('chats').add(data);
  }

  getAllGroupChats() {
    return this.afs
      .collection('chats', (ref) => ref.where('type', '==', 'group'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  sendPush(chatId: string | number, data: any, uid: string) {
    this.usersService
      .getUserById(uid)
      .pipe(
        tap((user: any) => {
          if (user.deviceId) {
            this.http
              .post(
                `https://fcm.googleapis.com/fcm/send`,
                {
                  registration_ids: [user?.deviceId?.value],
                  notification: {
                    body: data?.content,
                    sound: 'default',
                    click_action: 'FCM_PLUGIN_ACTIVITY',
                    icon: 'fcm_push_icon',
                  },
                  data: {
                    landing_page: 'messages/chat',
                    chatId,
                  },
                  /*  to: user?.deviceId.value, */
                  priority: 'high',
                  restricted_package_name: '',
                },
                {
                  headers: new HttpHeaders().set(
                    'Authorization',
                    `key=${environment.firebaseConfig.serverKey}`
                  ),
                }
              )
              .subscribe();
          }
        })
      )
      .subscribe();
  }
}
