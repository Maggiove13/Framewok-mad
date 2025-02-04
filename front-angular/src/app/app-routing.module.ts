import { Routes } from '@angular/router';
import { LinkListComponent } from './components/link-list/link-list.component';
import { LinkDetailComponent } from './components/link-detail/link-detail.component';

export const routes: Routes = [
  { path: '', component: LinkListComponent },
  { path: 'link/:id', component: LinkDetailComponent }
];