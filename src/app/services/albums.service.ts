import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { url_api } from '../../environments/environment';
import { LoginResponse } from '../interfaces/login-response';
import { Album } from '../interfaces/album';

@Injectable()
export class AlbumsService {

  constructor(private http: HttpClient) { }

  getAlbums() {
    return this.http.get<Album[]>(`${url_api}/albums`);
  }

  deleteAlbum(id) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.delete(`${url_api}/albums/${id}?access_token=${accessToken}`);
  }

  ajouterAlbum(nom, artiste, tracklist, prix, photos, deezer, spotify, itunes) {
    const accessToken = localStorage.getItem('accessToken');

    return this.http.post<Album>(`${url_api}/albums?access_token=${accessToken}`, {
      nom: nom,
      artiste: artiste,
      tracklist: tracklist,
      prix: prix,
      deezer: deezer,
      spotify: spotify,
      itunes: itunes,
      photos: photos,


   });
  }

  modifierAlbum(id, nom, artiste, tracklist, prix, photos, deezer, spotify, itunes) {

    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('accessToken');
      this.http.get<Album>(`${url_api}/albums/${id}`).subscribe(artiste =>{
        let formData = {};
        formData['nom'] = nom;
        formData['artiste'] = artiste;
        formData['prix'] = prix;
        formData['deezer'] = deezer;
        formData['spotify'] = spotify;
        formData['itunes'] = itunes;
        formData['listPhotos'] = photos;
        
        
        this.http.put<Album>(`${url_api}/albums/${id}?access_token=${accessToken}`, formData).subscribe(success => resolve(success));
      });
    });
  }

  uploadPhoto(file: File) {
    const accessToken = localStorage.getItem('accessToken');
    let formData = new FormData();
    formData.set('file', file, file.name);
    return this.http.post(`${url_api}/containers/albums/upload?access_token=${accessToken}`, formData);
  }

}
