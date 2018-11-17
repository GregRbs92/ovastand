import { Component, Input, Sanitizer } from '@angular/core';
import * as $ from 'jquery';
import { Collaborateur } from '../../interfaces/collaborateur';
import { CollaborateursService } from '../../services/collaborateurs.service';
import { url_api } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'edit-collab',
  templateUrl: './edit-collab.component.html',
  styleUrls: ['./edit-collab.component.scss']
})
export class EditCollabComponent {

  @Input()
  collabs: Collaborateur[];

  showModal: boolean = false;
  selectedCollab : Collaborateur;
  action: string;
  accessToken: string = localStorage.getItem('accessToken');
  form_url: string = url_api + '/containers/collaborateurs/upload?access_token=' + this.accessToken;

  constructor(private collabProvider: CollaborateursService) {

   }

  toggleModal(collab, action) {
    this.action = action;
    this.selectedCollab = collab;
    this.showModal = !this.showModal;
  }

  deleteCollab(idCollab) {
    this.collabProvider.deleteCollab(idCollab).subscribe(() => {
      this.collabProvider.getCollabs().subscribe(data => {
        this.collabs = data;
      });
    });
  }

  ajouterCollab(nom, fonction, email, photo) {
    let p = photo.files[0] ? photo.files[0].name : '';
    
    if (p) {
      this.collabProvider.uploadPhoto(photo.files[0]).subscribe();
    }

    this.collabProvider.ajouterCollab(nom, fonction, email, p).subscribe((collab) => {
      this.showModal = false;
      this.collabProvider.getCollabs().subscribe(data => {
        this.collabs = data;
      });
    });
  }

  modifierCollab(nom, fonction, email, photo) {
    let p = photo.files[0] ? photo.files[0].name : '';

    if (p) {
      this.collabProvider.uploadPhoto(photo.files[0]).subscribe();
    }

    this.collabProvider.modifierCollab(this.selectedCollab.id, nom, fonction, email, p).then((collab) => {
      this.showModal = false;
      this.collabProvider.getCollabs().subscribe(data => {
        this.collabs = data;
      });
    });
  }
}

