import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { Artiste } from '../../interfaces/artiste';
import { Album } from '../../interfaces/album';
import { url_api } from '../../../environments/environment';
import { ArtistesService } from '../../services/artistes.service';
import { AlbumsService } from '../../services/albums.service';
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
  albums: Album[];
  accessToken: string = localStorage.getItem('accessToken');

  videos = [];
  colors: {main_color: string, second_color: string} = {main_color: '', second_color: ''};

  constructor(private http: HttpClient, private artisteProvider: ArtistesService,private albumProvider: AlbumsService, private fs: FileService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.artisteProvider.getArtistes().subscribe(data => {
      this.artistes = data;
    });

    this.albumProvider.getAlbums().subscribe(data => {
      this.albums = data;
    });

    this.fs.getColors().subscribe(colors => {
      this.colors = colors;
    });

    // this.fs.getAssets().subscribe(data => {
    //   data.forEach(f => {
    //     switch (f.name) {
    //       case 'videos':
    //         this.videos = JSON.parse(f.url);
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    // });
  }

  setOption(page: number) {
    this.option = page;
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

