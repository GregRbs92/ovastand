import { Component, Input, Sanitizer, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import * as $ from 'jquery';
import { Album } from '../../interfaces/album';
import { AlbumsService } from '../../services/albums.service';
import { url_api } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'edit-albums',
  templateUrl: './edit-albums.component.html',
  styleUrls: ['./edit-albums.component.scss']
})
export class EditAlbumComponent {

  @Input()
  albums: Album[];
  

  showModal: boolean = false;
  selectedAlbum: Album;
  action: string;
  accessToken: string = localStorage.getItem('accessToken');
  form_url: string = url_api + '/containers/albums/upload?access_token=' + this.accessToken;

  constructor(private albumProvider: AlbumsService) {

  }

  toggleModal(album, action) {
    this.action = action;
    this.selectedAlbum = album;
    this.showModal = !this.showModal;
  }

  deleteAlbum(idAlbum) {
    this.albumProvider.deleteAlbum(idAlbum).subscribe(() => {
      this.albumProvider.getAlbums().subscribe(data => {
        this.albums = data;
      });
    });
  }

  ajouterAlbum(nom, artiste, prix, photos, deezer, spotify, itunes) {

      let photo = photos.files[0] ? photos.files[0].name : '';
      let url_photo = "";
      if (photo) {
          url_photo = `${url_api}/containers/albums/download/${photo}`;
          this.albumProvider.uploadPhoto(photos.files[0]).subscribe();
      }
    
    this.albumProvider.ajouterAlbum(nom, artiste, prix, url_photo, photo, deezer, spotify).subscribe((artiste) => {
      this.showModal = false;
      this.albumProvider.getAlbums().subscribe(data => {
        this.albums = data;
      });
    });
  }

  modifierAlbum(nom, artiste, prix, photos, deezer, spotify) {
    let photo = photos.files[0] ? photos.files[0].name : '';
    let url_photo = "";
    if (photo) {
      url_photo = `${url_api}/containers/albums/download/${photo}`;
      this.albumProvider.uploadPhoto(photos.files[0]).subscribe();
    }

    this.albumProvider.modifierAlbum(this.selectedAlbum.id, nom, artiste, prix, url_photo, photo, deezer, spotify).subscribe(artiste => {
      this.showModal = false;
      this.albumProvider.getAlbums().subscribe(data => {
        this.albums = data;
      });
    });
    }



}

