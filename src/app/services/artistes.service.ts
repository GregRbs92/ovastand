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

  ajouterArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture) {
    const accessToken = localStorage.getItem('accessToken');
    const p1 = `${url_api}/Containers/artistes/download/${photo_profil}`;
    const p2 = `${url_api}/Containers/artistes/download/${photo_couverture}`;
    return this.http.post<Artiste>(`${url_api}/artistes?access_token=${accessToken}`, {
      nom: nom,
      genre: genre,
      description: description,
      facebook: facebook,
      twitter: twitter,
      youtube: youtube,
      instagram: instagram,
      photo_profil: p1,
      photo_couverture: p2,
      website: website,
   });
  }

  modifierArtiste(id, nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture) {
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('accessToken');
      this.http.get<Artiste>(`${url_api}/artistes/${id}`).subscribe(artiste =>{
        let formData = {};
        formData['nom'] = nom;
        formData['genre'] = genre;
        formData['description'] = description;
        formData['facebook'] = facebook;
        formData['twitter'] = twitter;
        formData['youtube'] = youtube;
        formData['instagram'] = instagram;
        formData['website'] = website;
        formData['photo_profil'] = photo_profil !== '' ? `${url_api}/Containers/artistes/download/${photo_profil}` : artiste.photo_profil;
        formData['photo_couverture'] = photo_couverture !== '' ? `${url_api}/Containers/artistes/download/${photo_couverture}` : artiste.photo_couverture;
        
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
