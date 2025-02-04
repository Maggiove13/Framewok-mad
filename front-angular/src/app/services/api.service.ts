import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getLinks() {
    return this.http.get(`${this.API_URL}/links`);
  }

  createLink(link: any) {
    return this.http.post(`${this.API_URL}/links`, link);
  }

  getLink(id: string) {
    return this.http.get(`${this.API_URL}/links/${id}`);
  }

  updateLink(id: string, link: any) {
    return this.http.put(`${this.API_URL}/links/${id}`, link);
  }

  deleteLink(id: string) {
    return this.http.delete(`${this.API_URL}/links/${id}`);
  }

  voteLink(id: string, vote: number) {
    return this.http.post(`${this.API_URL}/links/${id}/vote`, { vote });
  }

  getComments(linkId: string) {
    return this.http.get(`${this.API_URL}/links/${linkId}/comments`);
  }

  addComment(linkId: string, comment: any) {
    return this.http.post(`${this.API_URL}/links/${linkId}/comments`, comment);
  }
}
