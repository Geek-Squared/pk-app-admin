import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(private firestore: AngularFirestore) {}

  createChat(chat: any) {
    return this.firestore.collection('chats').add(chat);
  }

  deleteChat(chatId: string) {
    return this.firestore.collection('chats').doc(chatId).delete();
  }

  updateChat(chat: any) {
    return this.firestore
      .collection('chats')
      .doc(chat.id)
      .set(chat, { merge: true });
  }

  getChatById(chatId: string) {
    return this.firestore.collection('chats').doc(chatId).valueChanges();
  }

  getChats() {
    return this.firestore.collection('chats').snapshotChanges();
  }

  getChatsByChapterId(chapterId: string) {
    return this.firestore
      .collection<any>('chats', (ref) =>
        ref.where('workbookId', '==', chapterId)
      )
      .snapshotChanges();
  }
}
