import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular/utils/loading';
import { UPost } from 'src/app/models/post.interface';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent implements OnInit {
  @Input() post: UPost;
  @Input() btnState: ClrLoadingState;
  @Input() title: string;
  @Input() imageSrc: string | ArrayBuffer;
  @Input() uploadProgress;
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  @Output() uploadFile = new EventEmitter();
  public opened = true;
  public postForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.post) {
      this.postForm.patchValue(this.post);
      this.imageSrc = this.post.imageUrl;
    }
  }

  private createForm() {
    this.postForm = this.fb.group({
      videoUrl: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', [Validators.required]],
      imageUrl: '',
      uid: '',
      id: '',
    });
  }

  public onFileInputChange(event) {
    const file = event.target.files[0];
    if (file.type.split('/')[0] !== 'image') {
      return alert('Pleas select an Image file');
    }
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
    }
    this.uploadFile.emit(file);
  }
}
