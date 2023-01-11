import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private firestore: AngularFirestore) {}

  createQuestion(question) {
    return this.firestore.collection('questions').add(question);
  }

  deleteQuestion(questionId: string) {
    return this.firestore.collection('questions').doc(questionId).delete();
  }

  updateQuestion(question) {
    return this.firestore
      .collection('questions')
      .doc(question.id)
      .set(question, { merge: true });
  }

  getQuestionById(questionId: string) {
    return this.firestore
      .collection('questions')
      .doc(questionId)
      .valueChanges();
  }

  getQuestions() {
    return this.firestore.collection('questions').snapshotChanges();
  }

  getQuestionsByPostId(postId: string) {
    return this.firestore
      .collection<any>('questions', (ref) => ref.where('postId', '==', postId))
      .snapshotChanges();
  }
}
