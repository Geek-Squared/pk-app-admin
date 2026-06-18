import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: AngularFirestore) {}

  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  getUserById(userId: string) {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  updateUser(userId: string, data: any) {
    return this.firestore.collection('users').doc(userId).set(data, { merge: true });
  }

  archiveUser(userId: string, archived: boolean) {
    return this.firestore.collection('users').doc(userId).set({ archived }, { merge: true });
  }

  deleteUser(userId: string) {
    return this.firestore.collection('users').doc(userId).delete();
  }
}
