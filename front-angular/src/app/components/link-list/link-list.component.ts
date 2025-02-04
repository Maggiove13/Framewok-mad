import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service'; 


@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})

export class LinkListComponent implements OnInit {
  links: any[] = [];
  filteredLinks: any[] = [];

  constructor(private linkService: ApiService) { }

  ngOnInit() {
    this.fetchLinks();
  }

  fetchLinks() {
    this.linkService.getLinks().subscribe((data: any) => {
      this.links = data.links;
      this.filteredLinks = data.links;
    });
  }

  createLink(event: any) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const link = {
      title: formData.get('title'),
      url: formData.get('url'),
      description: formData.get('description'),
      tags: formData.get('tags')?.toString().split(',').map(t => t.trim()).filter(t => t) || []
    };

    this.linkService.createLink(link).subscribe(() => {
      this.fetchLinks();
      form.reset();
    });
  }

  filterByTag(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredLinks = this.links.filter(link => 
      link.tags.some((tag: string) => tag.toLowerCase().includes(filterValue))
    );
  }

  voteLink(id: string) {
    this.linkService.voteLink(id, 1).subscribe(() => {
      this.fetchLinks();
    });
  }

  deleteLink(id: string) {
    if (confirm('¿Estás seguro de eliminar este enlace?')) {
      this.linkService.deleteLink(id).subscribe(() => {
        this.fetchLinks();
      });
    }
  }

  editLink(link: any) {
    const newTitle = prompt('Editar título', link.title);
    const newUrl = prompt('Editar URL', link.url);
    const newDescription = prompt('Editar descripción', link.description);
    const newTags = prompt('Editar tags (separadas por coma)', link.tags.join(','));

    if (newTitle && newUrl) {
      const updatedLink = {
        title: newTitle,
        url: newUrl,
        description: newDescription,
        tags: newTags?.split(',').map(t => t.trim()).filter(t => t)
      };

      this.linkService.updateLink(link.id, updatedLink).subscribe(() => {
        this.fetchLinks();
      });
    }
  }
}