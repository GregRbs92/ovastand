import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { Artiste } from '../../interfaces/artiste';
import { url_api } from '../../../environments/environment';
import { ArtistesService } from '../../services/artistes.service';
import { FileService } from '../../services/files.service';
import { Partenaire } from '../../interfaces/partenaires';
import { PartenairesService } from '../../services/partenaires.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  animations: [
    trigger('slideDown', [
      state('void', style({
        opacity: 0,
        height: '0px'
      })),
      state('*',   style({
        opacity: 1,
        height: '400px'
      })),
      transition('void => *', animate('500ms ease-in')),
      transition('* => void', animate('500ms ease-out'))
    ])
  ]
})
export class HomepageComponent implements OnInit {

  hidePortfolio: boolean = null;
  scrolled: boolean = false;
  affiche: string = "";
  video: string = "";
  videoPoster: string = "";
  videos = [];
  artistes: Artiste[];
  artisteFocused: Artiste;
  descriptionOnFocus: string[];
  connectionError: boolean = false;
  colors: {main_color: string, second_color: string} = {main_color: "#ed6f7d", second_color: "#333"};
  partenaires: Partenaire[];

  constructor(private http:HttpClient, private artisteProvider:ArtistesService, private partenaireProvider: PartenairesService, private fs:FileService, private sanitizer : DomSanitizer) {
  }

  ngOnInit() {

    this.artisteProvider.getArtistes().subscribe(data => {
      if(data) {
        this.connectionError = false;
        this.artistes = data;
      }
    }, err => {
      console.log(err);
      this.connectionError = true;
    });

    this.fs.getAssets().subscribe(data => {
      data.forEach(f => {
        switch (f.name) {
          case 'affiche':
            this.affiche = `${url_api}/Containers/media/download/${f.url}`;
            break;
          case 'video':
            this.video = `${url_api}/Containers/media/download/${f.url}`;
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

    this.partenaireProvider.getPartenaire().subscribe(data => {
      this.partenaires = data;
    });

    this.fs.getColors().subscribe(data => {
      console.log(data);
      this.colors = data;
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    if(!this.scrolled && window.pageYOffset > 100) {
      this.scrolled = true;
    }
    else if(this.scrolled && window.pageYOffset <= 100) {
      this.scrolled = false;
    }
  }

  
  selectArtiste(artiste : Artiste) {
    this.artisteFocused = artiste;
    this.descriptionOnFocus = artiste.description.split('\n');
  }

  closePortfolio(){
    this.artisteFocused = null;
  }

  videoUrlSanitized(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}


