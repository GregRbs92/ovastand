import { Component, Input, Sanitizer } from '@angular/core';
import * as $ from 'jquery';
import { Artiste } from '../../interfaces/artiste';
import { ArtistesService } from '../../services/artistes.service';
import { url_api } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'edit-artistes',
  templateUrl: './edit-artistes.component.html',
  styleUrls: ['./edit-artistes.component.scss']
})
export class EditArtistesComponent {

  @Input()
  artistes: Artiste[];

  showModal: boolean = false;
  selectedArtiste: Artiste;
  action: string;
  accessToken: string = localStorage.getItem('accessToken');
  form_url: string = url_api + '/Containers/artistes/upload?access_token=' + this.accessToken;

  constructor(private artisteProvider: ArtistesService) {

   }

  toggleModal(artiste, action) {
    this.action = action;
    this.selectedArtiste = artiste;
    this.showModal = !this.showModal;
  }

  deleteArtiste(idArtiste) {
    this.artisteProvider.deleteArtiste(idArtiste).subscribe(() => {
      this.artisteProvider.getArtistes().subscribe(data => {
        this.artistes = data;
      });
    });
  }

  ajouterArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture) {
    let p1 = photo_profil.files[0] ? photo_profil.files[0].name : '';
    let p2 = photo_couverture.files[0] ? photo_couverture.files[0].name : '';
    if (p1) {
      this.artisteProvider.uploadPhoto(photo_profil.files[0]).subscribe();
      
    }
    if (p2) {
      this.artisteProvider.uploadPhoto(photo_couverture.files[0]).subscribe();
    }
    this.artisteProvider.ajouterArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, p1, p2).subscribe((artiste) => {
      this.showModal = false;
      this.artisteProvider.getArtistes().subscribe(data => {
        this.artistes = data;
      });
    });
  }

  modifierArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture) {
    let p1 = photo_profil.files[0] ? photo_profil.files[0].name : '';
    let p2 = photo_couverture.files[0] ? photo_couverture.files[0].name : '';
    if (p1) {
      this.artisteProvider.uploadPhoto(photo_profil.files[0]).subscribe();
    }
    if (p2) {
      this.artisteProvider.uploadPhoto(photo_couverture.files[0]).subscribe();
    }
    this.artisteProvider.modifierArtiste(this.selectedArtiste.id, nom, genre, description, facebook, twitter, youtube, instagram, website, p1, p2).then((artiste) => {
      this.showModal = false;
      this.artisteProvider.getArtistes().subscribe(data => {
        this.artistes = data;
      });
    });
  }
}

