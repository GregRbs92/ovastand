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

  getAlbum(id){
    return this.http.get<Album>(`${url_api}/albums/${id}`); 
  }
  
  deleteAlbum(id) {
    const accessToken = localStorage.getItem('accessToken');
    var album: Album; 
    this.getAlbum(id).subscribe(data => { 
        album = data;
        this.deletePhoto(album.photo);
    });
    return this.http.delete(`${url_api}/albums/${id}?access_token=${accessToken}`);
  }

  ajouterAlbum(nom, artiste, prix, url_photo, photo, deezer, spotify) {
    const accessToken = localStorage.getItem('accessToken');

    return this.http.post<Album>(`${url_api}/albums?access_token=${accessToken}`, {
      nom: nom,
      artiste: artiste,
      prix: prix,
      url_photo: url_photo,
      photo: photo,
      deezer: deezer,
      spotify: spotify
   });
  }

  modifierAlbum(id, nom, art, prix, url_photo, photo, deezer, spotify) {

    return new Promise((resolve, reject) => {
        const accessToken = localStorage.getItem('accessToken');
        this.getAlbum(id).subscribe(data => {
            let album = data;
           
            if (!photo) {
                photo = album.photo;
                url_photo = album.url_photo;
            }
            else
                this.deletePhoto(album.photo);
        });

        this.http.get<Album>(`${url_api}/albums/${id}`).subscribe(artiste =>{
        let formData = {};
        formData['nom'] = nom;
        formData['artiste'] = art;
        formData['prix'] = +prix;
        formData['url_photo'] = url_photo;
        formData['photo'] = photo;
        formData['deezer'] = deezer;
        formData['spotify'] = spotify;
        
        
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

  deletePhoto(photo: string){
    const accessToken = localStorage.getItem('accessToken');
    return this.http.delete(`${url_api}/Containers/albums/files/${photo}?access_token=${accessToken}`).subscribe();
  }

}
