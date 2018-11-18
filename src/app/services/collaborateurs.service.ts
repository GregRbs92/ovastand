import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { url_api } from '../../environments/environment';
import { LoginResponse } from '../interfaces/login-response';
import { Collaborateur } from '../interfaces/collaborateur';

@Injectable()
export class CollaborateursService {

  constructor(private http: HttpClient) { }

  getCollabs() {
    return this.http.get<Collaborateur[]>(`${url_api}/collaborateurs`);
  }

  getCollab(id){
    return this.http.get<Collaborateur>(`${url_api}/albums/${id}`); 
  }

  deleteCollab(id) {
    const accessToken = localStorage.getItem('accessToken');
    var collab : Collaborateur;
    this.getCollab(id).subscribe(data => { 
      collab = data
      var photo = collab.photo.split("/")[7];

      this.deletePhoto(photo);
    });
    return this.http.delete(`${url_api}/collaborateurs/${id}?access_token=${accessToken}`);
  }

  ajouterCollab(nom, fonction, email, photo) {
    const accessToken = localStorage.getItem('accessToken');
    const p = `${url_api}/containers/collaborateurs/download/${photo}`;
    return this.http.post<Collaborateur>(`${url_api}/collaborateurs?access_token=${accessToken}`, {
      nom: nom,
      fonction: fonction,
      email: email,
      photo: p
   });
  }

  modifierCollab(id, nom, fonction, email, photo) {

    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('accessToken');
      
      if(photo){
        photo = `${url_api}/containers/collaborateurs/download/${photo}`;
        var collab : Collaborateur;
        this.getCollab(id).subscribe(data => { 
          collab = data
          var photo_prof = collab.photo.split("/")[7];        
          this.deletePhoto(photo_prof);
        });
      }
      else{
        this.getCollab(id).subscribe( data => {
          photo = data.photo;
        })
      }
      
      this.http.get<Collaborateur>(`${url_api}/collaborateurs/${id}`).subscribe(artiste =>{
        let formData = {};
        formData['nom'] = nom;
        formData['fonction'] = fonction;
        formData['email'] = email;
        formData['photo'] = photo;
        
        this.http.put<Collaborateur>(`${url_api}/collaborateurs/${id}?access_token=${accessToken}`, formData).subscribe(success => resolve(success));
      });
    });
  }

  uploadPhoto(file: File) {
    const accessToken = localStorage.getItem('accessToken');
    let formData = new FormData();
    formData.set('file', file, file.name);
    return this.http.post(`${url_api}/containers/collaborateurs/upload?access_token=${accessToken}`, formData);
  }

  deletePhoto(photo: string){
    const accessToken = localStorage.getItem('accessToken');
    return this.http.delete(`${url_api}/Containers/collaborateurs/files/${photo}?access_token=${accessToken}`).subscribe();
  }

}
