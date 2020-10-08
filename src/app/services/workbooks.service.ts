import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class WorkbooksService {
  constructor(private firestore: AngularFirestore) {}

  getPosts() {
    return this.firestore.collection('workbooks').snapshotChanges();
  }
}
