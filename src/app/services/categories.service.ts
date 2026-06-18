import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
    // No orderBy: Firestore's orderBy('order') silently drops any category
    // missing the `order` field, which made the per-intervention category
    // view look empty. Consumers filter/sort client-side as needed.
    return this.firestore
      .collection<Category>('categories')
      .snapshotChanges();
  }

  updateCategory(category: Category) {
    return this.firestore
      .collection('categories')
      .doc(category.id)
      .set(category, { merge: true });
  }

  getCategoriesByInterventionId(interventionId: string) {
    return this.firestore
      .collection<any>('categories', (ref) =>
        ref.where('interventionId', '==', interventionId).orderBy('order')
      )
      .snapshotChanges();
  }
}
