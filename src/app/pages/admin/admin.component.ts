import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { Artiste } from '../../interfaces/artiste';
import { url_api } from '../../../environments/environment';
import { ArtistesService } from '../../services/artistes.service';
import { FileService } from '../../services/files.service';
import { VideoComponent } from '../../components/video/video.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  option: number = 1;
  artistes: Artiste[];
  accessToken: string = localStorage.getItem('accessToken');
  formUrl: string = `${url_api}/Containers/media/upload?access_token=${this.accessToken}`;
  afficheUrl: string;
  videoUrl: string;
  videoPoster: string = '';
  videos = [];
  colors: {main_color: string, second_color: string} = {main_color: '', second_color: ''};

  constructor(private http: HttpClient, private artisteProvider: ArtistesService, private fs: FileService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.artisteProvider.getArtistes().subscribe(data => {
      this.artistes = data;
    });

    this.fs.getColors().subscribe(colors => {
      this.colors = colors;
    });

    this.fs.getAssets().subscribe(data => {
      data.forEach(f => {
        switch (f.name) {
          case 'affiche':
            this.afficheUrl = `${url_api}/Containers/media/download/${f.url}`;
            break;
          case 'video':
            this.videoUrl = `${url_api}/Containers/media/download/${f.url}`;
            break;
          case 'videoPoster':
            this.videoPoster = `${url_api}/Containers/media/download/${f.url}`;
            break;
          case 'videos':
            this.videos = JSON.parse(f.url);
            break;
          default:
            break;
        }
      });
    });
  }

  setOption(page: number) {
    this.option = page;
  }

  onAfficheSubmit(e) {
    e.preventDefault();
    const file = e.target[0].files[0];
    this.fs.uploadAffiche(file).subscribe(success => {
      this.fs.setAffiche(file.name).subscribe(res => {
        this.afficheUrl = `${url_api}/Containers/media/download/${file.name}`;
      });
    });
  }

  onVideoSubmit(e) {
    const fileName = e.target[0].files[0].name;
    this.fs.setVideo(fileName).subscribe();
  }

  onChangeVideoPoster(file: File) {
    this.fs.uploadAffiche(file).subscribe(success => {
      this.fs.setVideoPoster(file.name).subscribe();
    });
  }

  removeVideo(id: number) {
    this.videos.splice(id, 1);
    this.fs.setVideos(this.videos).subscribe();
  }

  addVideo(lien: string) {
    this.videos.push(lien);
    this.fs.setVideos(this.videos).subscribe();
  }

  sanitize(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

