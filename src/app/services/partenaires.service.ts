import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { url_api } from '../../environments/environment';
import { LoginResponse } from '../interfaces/login-response';
import { Partenaire } from '../interfaces/partenaires';

@Injectable()
export class PartenairesService{

    constructor(private http : HttpClient) { }

    getPartenaires(){
        return this.http.get<Partenaire[]>(`${url_api}/partenaires`);
    }

    deletePartenaire(id){
        const accessToken = localStorage.getItem('accessToken');
        return this.http.delete(`${url_api}/partenaires/${id}?access_token=${accessToken}`);
    }

    ajouterPartenaire(nom, image, url){
        const access_token = localStorage.getItem('accessToken');
        const m = `${url_api}/Containers/partenaires/download/${image}`;
        return this.http.post<Partenaire>(`${url_api}/partenaires?access_token=${access_token}`, {
            nom : nom,
            logo : m,
            url : url
        });
    }

    uploadImage(image: File) {
        const accessToken = localStorage.getItem('accessToken');
        let formData = new FormData();
        formData.set('file', image, image.name);
        return this.http.post(`${url_api}/Containers/partenaires/upload?access_token=${accessToken}`, formData);
    }
}


