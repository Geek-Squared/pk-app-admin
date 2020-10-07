import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  uploadPercent: Observable<number>;
  downloadUrlChange: Subject<any> = new Subject<any>();
  downloadURL: string;

  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore
  ) {}

  uploadFile(file: any | null) {
    const filePath = `positive-konnections/${file.name}`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            console.log(url);

            this.downloadURL = url;
            this.downloadUrlChange.next(this.downloadURL);
          });
        })
      )
      .subscribe();
  }
}
