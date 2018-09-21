import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { url_api } from '../../environments/environment';
import { Asset } from '../interfaces/asset';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class FileService {

  constructor(private http: HttpClient) {}

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${url_api}/assets`);
  }

  setAffiche(name: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<Asset>(`${url_api}/assets/update?where=%7B%22name%22%3A%20%22affiche%22%7D&access_token=${accessToken}`, {url: name});
  }

  uploadAffiche(affiche: File) {
    const accessToken = localStorage.getItem('accessToken');
    let formData = new FormData();
    formData.set('file', affiche, affiche.name);
    return this.http.post(`${url_api}/Containers/media/upload?access_token=${accessToken}`, formData);
  }

  setVideo(name: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<Asset>(`${url_api}/assets/update?where=%7B%22name%22%3A%20%22video%22%7D&access_token=${accessToken}`, {url: name});
  }

  setVideoPoster(name: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<Asset>(`${url_api}/assets/update?where=%7B%22name%22%3A%20%22videoPoster%22%7D&access_token=${accessToken}`, {url: name});
  }

  setVideos(videos) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<Asset>(`${url_api}/assets/update?where=%7B%22name%22%3A%20%22videos%22%7D&access_token=${accessToken}`, {url: JSON.stringify(videos)});
  }

  setMainColor(color: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<string>(`${url_api}/assets/changeColor?access_token=${accessToken}`, {color: color, nameOfColor: 'main'});
  }

  setSecondColor(color: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<string>(`${url_api}/assets/changeColor?access_token=${accessToken}`, {color: color, nameOfColor: 'second'});
  }

  getColors() {
    return this.http.get<{main_color: string, second_color: string}>('../../../assets/config.json');
  }
}
