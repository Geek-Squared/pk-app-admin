import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: AngularFirestore) {}

  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  getUserById(userId: string) {
    return this.firestore.collection('userId').doc(userId).valueChanges();
  }
}
