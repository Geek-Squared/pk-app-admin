import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { map } from 'rxjs/operators';
import { Chapter } from '../models/chapter.interface';

@Injectable({
  providedIn: 'root',
})
export class ChaptersService {
  constructor(private firestore: AngularFirestore) {}

  createChapter(chapter: Chapter) {
    return this.firestore.collection('chapters').add(chapter);
  }

  deleteChapter(chapterId: string) {
    return this.firestore.collection('chapters').doc(chapterId).delete();
  }

  getChapterById(chapterId: string) {
    return this.firestore
      .collection('chapters')
      .doc<Chapter>(chapterId)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  getChapters() {
    return this.firestore
      .collection<Chapter>('chapters', (ref) => ref.orderBy('order'))
      .snapshotChanges();
  }

  updateChapter(chapter: Chapter) {
    return this.firestore
      .collection('chapters')
      .doc(chapter.id)
      .set(chapter, { merge: true });
  }

  getChaptersByCategoryIdAndInterventionId(
    categoryId: string,
    interventionId: string
  ) {
    return this.firestore
      .collection<any>('chapters', (ref) =>
        ref
          .where('categoryId', '==', categoryId)
          .where('interventionId', '==', interventionId)
      )
      .snapshotChanges();
  }

  bulkUpdate() {
    const batch = firebase.firestore().batch();

    this.firestore
      .collection('chapters')
      .get()
      .subscribe((docs) => {
        docs.forEach((element) => {
          batch.update(
            this.firestore.collection('chapters').doc(element.id).ref,
            {
              categoryId: 'LnxI6W6RjA4zNotOGdPq',
            }
          );
        });

        batch.commit().then(
          (res) => console.log('Batch completed!'),
          (err) => console.error(err)
        );
      });
  }
}
