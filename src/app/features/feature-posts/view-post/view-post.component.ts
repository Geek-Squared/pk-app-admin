import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UPost } from 'src/app/models/post.interface';
import { PostsService } from 'src/app/services';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
})
export class ViewPostComponent implements OnInit {
  public post$ = this.postsService.getPostById(
    this.route.snapshot.paramMap.get('postId')
  ) as Observable<UPost>;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}
