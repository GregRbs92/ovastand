import { Component, Input, Sanitizer } from '@angular/core';
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
  form_url: string = url_api + '/Containers/albums/upload?access_token=' + this.accessToken;

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

  ajouterAlbum(nom, artiste, tracklist, prix, photos, deezer, spotify, itunes) {
    

    let listPhotos:string[];
    photos.forEach(photo => {
      let url = `${url_api}/Containers/albums/download/${photo}`;
      listPhotos.push(url);
      this.albumProvider.uploadAffiche(photo).subscribe();
    });

    this.albumProvider.ajouterAlbum(nom, artiste, tracklist, prix, photos, deezer, spotify, itunes).subscribe((artiste) => {
      this.showModal = false;
      this.albumProvider.getAlbums().subscribe(data => {
        this.albums = data;
      });
    });
  }

  modifierAlbum(nom, artiste, tracklist, prix, photos, deezer, spotify, itunes) {
    let listPhotos:string[];
    photos.forEach(photo => {
      let url = `${url_api}/Containers/albums/download/${photo}`;
      listPhotos.push(url);
      this.albumProvider.uploadAffiche(photo).subscribe();
    });
    
    this.albumProvider.modifierAlbum(this.selectedAlbum.id, nom, artiste, tracklist, prix, photos, deezer, spotify, itunes).then((artiste) => {
      this.showModal = false;
      this.albumProvider.getAlbums().subscribe(data => {
        this.albums = data;
      });
    });
  }
}

