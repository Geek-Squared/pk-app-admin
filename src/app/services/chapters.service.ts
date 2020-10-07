import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
    return this.firestore.collection('chapters').doc<Chapter>(chapterId).valueChanges();
  }

  getChapters() {
    return this.firestore.collection<Chapter>('chapters').snapshotChanges();
  }
}
