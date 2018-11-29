import { Injectable, Input } from '@angular/core';
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

  getArtiste(id) {
    return this.http.get<Artiste>(`${url_api}/artistes/${id}`);
  }

  deleteArtiste(id) {
    const accessToken = localStorage.getItem('accessToken');
    var artiste: Artiste; 
    this.getArtiste(id).subscribe(data => { 
      artiste = data
      var photo_prof = artiste.photo_profil.split("/")[7];
      var photo_couv = artiste.photo_couverture.split("/")[7];
      this.deletePhoto(photo_prof);
      this.deletePhoto(photo_couv);

      var ordre = artiste.ordre;
      this.getArtistes().subscribe(data => {
        data = data.filter(artiste => artiste.ordre > ordre);
        data.forEach(artiste => {
          this.setArtisteOrdre(artiste.id, artiste.ordre - 1);
        });
      })
    });
    

    return this.http.delete(`${url_api}/artistes/${id}?access_token=${accessToken}`);
    
  }

  ajouterArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture, ordre, urlYt1, urlYt2, tabDates) {
    const accessToken = localStorage.getItem('accessToken');
    const p1 = `${url_api}/containers/artistes/download/${photo_profil}`;
    const p2 = `${url_api}/containers/artistes/download/${photo_couverture}`;

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
      ordre: ordre,
      videoUrl1: urlYt1,
      videoUrl2: urlYt2,
      tourDates: tabDates
   });
  }

  modifierArtiste(id, nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture, urlYt1, urlYt2, tabDates) {
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('accessToken');
      var p1;
      var p2;
      if(photo_profil){
        p1 = `${url_api}/containers/artistes/download/${photo_profil}`;
        var artiste : Artiste;
        this.getArtiste(id).subscribe(data => { 
          artiste = data
          if (artiste.photo_couverture != artiste.photo_profil) {
            var photo_prof = artiste.photo_profil.split("/")[7];        
          this.deletePhoto(photo_prof);
          }
        });
      }
      else{
        this.getArtiste(id).subscribe( data => {
          p1 = data.photo_profil;
        });
      }

      if(photo_couverture){
        p2 = `${url_api}/containers/artistes/download/${photo_couverture}`;
        var artiste : Artiste;
        this.getArtiste(id).subscribe(data => { 
          artiste = data
          if (artiste.photo_couverture != artiste.photo_profil) {
            var photo_couverture = artiste.photo_couverture.split("/")[7];        
          this.deletePhoto(photo_couverture);
          }
        });
      }
      else{
        this.getArtiste(id).subscribe( data => {
          p2 = data.photo_couverture;
        });
      }  
        
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
        formData['photo_profil'] = p1;
        formData['photo_couverture'] = p2; 
        formData['videoUrl1'] = urlYt1;
        formData['videoUrl2'] = urlYt2;
        formData['tourDates'] = tabDates;
        
        this.http.put<Artiste>(`${url_api}/artistes/${id}?access_token=${accessToken}`, formData).subscribe(success => resolve(success));
      });
    });
  }

  uploadPhoto(file: File) {
    const accessToken = localStorage.getItem('accessToken');
    let formData = new FormData();
    formData.set('file', file, file.name);
    return this.http.post(`${url_api}/containers/artistes/upload?access_token=${accessToken}`, formData);
  }

  deletePhoto(photo: string){
    const accessToken = localStorage.getItem('accessToken');
    return this.http.delete(`${url_api}/Containers/artistes/files/${photo}?access_token=${accessToken}`).subscribe();
  }

  setArtisteOrdre(id: number, ordre: number){
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('accessToken');
      this.http.get<Artiste>(`${url_api}/artistes/${id}`).subscribe(artiste =>{
        let formData = {};
        formData['nom'] = artiste.nom;
        formData['genre'] = artiste.genre;
        formData['description'] = artiste.description;
        formData['facebook'] = artiste.facebook;
        formData['twitter'] = artiste.twitter;
        formData['youtube'] = artiste.youtube;
        formData['instagram'] = artiste.instagram;
        formData['website'] = artiste.website;
        formData['photo_profil'] = artiste.photo_profil
        formData['photo_couverture'] = artiste.photo_couverture; 
        formData['ordre'] = ordre;
        
        this.http.put<Artiste>(`${url_api}/artistes/${id}?access_token=${accessToken}`, formData).subscribe(success => resolve(success));
      });
    });
  }

}
