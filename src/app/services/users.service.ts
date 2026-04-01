import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: AngularFirestore) {}

  getUsers() {
    return this.firestore
      .collection('users')
      .snapshotChanges()
      .pipe(tap((users) => console.log('Raw Users from Service:', users)));
  }

  getUserById(userId: string) {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  updateUser(userId: string, data: any) {
    return this.firestore.collection('users').doc(userId).update(data);
  }
}
