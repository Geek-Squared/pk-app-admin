import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  public uploadPercent: Observable<number>;
  public audioPercent: Observable<number>;
  public downloadUrlChange: Subject<any> = new Subject<any>();
  public downloadURL: string;
  public audioMedia: string;
  public videoMedia: string;

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
            this.downloadURL = url;
            this.downloadUrlChange.next(this.downloadURL);
          });
        })
      )
      .subscribe();
  }

  uploadMedia(file: any | null, type: MediaType) {
    const filePath = `positive-konnections/${type}/${file.name}`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    this.audioPercent = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            type === MediaType.Audio
              ? (this.audioMedia = url)
              : (this.videoMedia = url);
          });
        })
      )
      .subscribe();
  }
}

export enum MediaType {
  Video = 'video',
  Audio = 'audio',
}
