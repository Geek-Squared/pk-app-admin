import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private usersService: UsersService
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

      return ref.update({
        messages: firebase.firestore.FieldValue.arrayUnion(data),
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap((c) => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map((v) => v.uid)));

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
