import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkbooksService {
  constructor(private firestore: AngularFirestore) {}

  getWorkbooks() {
    return this.firestore.collection('workbooks').snapshotChanges();
  }

  getWorkBook(userUid: string) {
    return this.firestore
      .collection('workbooks', (ref) => ref.where('uid', '==', userUid))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return data;
          });
        })
      );
  }
}
