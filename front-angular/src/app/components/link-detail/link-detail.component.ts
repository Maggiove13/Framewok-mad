import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-link-detail',
  templateUrl: './link-detail.component.html',
  styleUrls: ['./link-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})

export class LinkDetailComponent implements OnInit {
  link: any;
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private linkService: ApiService 
  ) { }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLinkDetails(id);
      this.loadComments(id);
    }
  }

  loadLinkDetails(id: string) {
    this.linkService.getLink(id).subscribe((data: any) => {
      this.link = data.link;
    });
  }

  loadComments(linkId: string) {
    this.linkService.getComments(linkId).subscribe((data: any) => {
      this.comments = data.comments;
    });
  }

  addComment(event: any) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const comment = {
      email: formData.get('email'),
      content: formData.get('content')
    };

    this.linkService.addComment(this.link.id, comment).subscribe(() => {
      this.loadComments(this.link.id);
      form.reset();
    });
  }

  voteLink() {
    this.linkService.voteLink(this.link.id, 1).subscribe(() => {
      this.loadLinkDetails(this.link.id);
    });
  }
}