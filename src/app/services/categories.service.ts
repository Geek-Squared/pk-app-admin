import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestore: AngularFirestore) {}

  createCategory(category: Category) {
    return this.firestore.collection('categories').add(category);
  }

  deleteCategory(categoryId: string) {
    return this.firestore
      .collection('categories')
      .doc(categoryId)
      .delete();
  }

  getCategoryById(categoryId: string) {
    return this.firestore
      .collection('categories')
      .doc<Category>(categoryId)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  getCategories() {
    return this.firestore
      .collection<Category>('categories', (ref) => ref.orderBy('order'))
      .snapshotChanges();
  }

  updateCategory(category: Category) {
    return this.firestore
      .collection('categories')
      .doc(category.id)
      .set(category, { merge: true });
  }

  getCategoriesByCategoryId(categoryId: string) {
    return this.firestore
      .collection<any>('categories', (ref) =>
        ref.where('categoryId', '==', categoryId).orderBy('order')
      )
      .snapshotChanges();
  }
}
