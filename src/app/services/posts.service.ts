import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UPost } from '../models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private firestore: AngularFirestore) {}

  createPost(post: UPost) {
    return this.firestore.collection('posts').add(post);
  }

  deletePost(postId: string) {
    return this.firestore.collection('posts').doc(postId).delete();
  }

  updatePost(post: UPost) {
    return this.firestore
      .collection('posts')
      .doc(post.id)
      .set(post, { merge: true });
  }

  getPostById(postId: string): Observable<any> {
    return this.firestore.collection('posts').doc(postId).valueChanges();
  }

  getPosts() {
    return this.firestore.collection('posts').snapshotChanges();
  }

  getPostsByChapterId(chapterId: string) {
    return this.firestore
      .collection<any>('posts', (ref) =>
        ref.where('chapterId', '==', chapterId)
      )
      .snapshotChanges();
  }
}
