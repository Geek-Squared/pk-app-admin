import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostsService, WorkbooksService } from 'src/app/services';

@Component({
  selector: 'app-view-workbook',
  templateUrl: './view-workbook.component.html',
  styleUrls: ['./view-workbook.component.scss'],
})
export class ViewWorkbookComponent implements OnInit {
  public workbook;

  constructor(
    private workbooksService: WorkbooksService,
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.workbooksService
      .getWorkBook(this.route.snapshot.paramMap.get('userUid'))
      .subscribe((res: any) => (this.workbook = res[0]?.responses));
  }

  public getPost(postId) {
    return this.postsService.getPostById(postId);
  }
}
