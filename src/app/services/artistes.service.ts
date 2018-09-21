import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { url_api } from '../../environments/environment';
import { LoginResponse } from '../interfaces/login-response';
import { Artiste } from '../interfaces/artiste';

@Injectable()
export class ArtistesService {

  constructor(private http: HttpClient) { }

  getArtistes() {
    return this.http.get<Artiste[]>(`${url_api}/artistes`);
  }

  deleteArtiste(id) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.delete(`${url_api}/artistes/${id}?access_token=${accessToken}`);
  }

  ajouterArtiste(nom, style, description, photo, lien, video) {
    const accessToken = localStorage.getItem('accessToken');
    const p = `${url_api}/Containers/artistes/download/${photo}`;
    return this.http.post<Artiste>(`${url_api}/artistes?access_token=${accessToken}`, {
      nom: nom,
      styleMusical: style,
      description: description,
      photo: p,
      lien: lien,
      video: video
   });
  }

  modifierArtiste(id, nom, style, description, photo, lien, video) {
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('accessToken');
      this.http.get<Artiste>(`${url_api}/artistes/${id}`).subscribe(artiste =>{
        let formData = {};
        formData['nom'] = nom;
        formData['styleMusical'] = style;
        formData['description'] = description;
        formData['photo'] = photo !== '' ? `${url_api}/Containers/artistes/download/${photo}` : artiste.photo;
        formData['lien'] = lien;
        formData['video'] = video;
        this.http.put<Artiste>(`${url_api}/artistes/${id}?access_token=${accessToken}`, formData).subscribe(success => resolve(success));
      });
    });
  }

  uploadAffiche(file: File) {
    const accessToken = localStorage.getItem('accessToken');
    let formData = new FormData();
    formData.set('file', file, file.name);
    return this.http.post(`${url_api}/Containers/artistes/upload?access_token=${accessToken}`, formData);
  }

}
