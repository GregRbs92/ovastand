import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';

import { Artiste } from '../../interfaces/artiste';
import { Album } from '../../interfaces/album';
import { Collaborateur}  from '../../interfaces/collaborateur';
import { url_api } from '../../../environments/environment';
import { ArtistesService } from '../../services/artistes.service';
import { AlbumsService } from '../../services/albums.service';
import { CollaborateursService } from '../../services/collaborateurs.service'
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

    option: number = 1;
    hidePortfolio: boolean = null;
    scrolled: boolean = false;
    videos = [];
    artistes: Artiste[];
    albums: Album[];
    collabs: Collaborateur[];
    artisteFocused: Artiste;
    albumFocused: Album; 
    collabFocused: Collaborateur;
    descriptionOnFocus: string[];
    connectionError: boolean = false;
    colors: { main_color: string, second_color: string } = {
        main_color: "#ed6f7d",
        second_color: "#333"
    };
    logo: string = "../../../assets/logo-noir.png";

    partenaires: Partenaire[];

  constructor(private http:HttpClient, private collabProvider:CollaborateursService, private artisteProvider:ArtistesService,private albumProvider:AlbumsService, private partenaireProvider: PartenairesService, private fs:FileService, private sanitizer : DomSanitizer) {
  }

  ngOnInit() {

    this.artisteProvider.getArtistes().subscribe(data => {
      if(data) {
        this.connectionError = false;
        this.artistes = data.sort(this.compareOrder);
      }
    }, err => {
      console.log(err);
      this.connectionError = true;
    });

    this.albumProvider.getAlbums().subscribe(data => {
      if(data) {
        this.connectionError = false;
        this.albums = data;
      }
    }, err => {
      console.log(err);
      this.connectionError = true;
    });

    this.collabProvider.getCollabs().subscribe(data => {
      if(data) {
        this.connectionError = false;
        this.collabs = data;
      }
    }, err => {
      console.log(err);
      this.connectionError = true;
    });

    this.fs.getColors().subscribe(data => {
      this.colors = data;
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    if(!this.scrolled && window.pageYOffset > 100) {
        this.scrolled = true;
        this.logo = "../../../assets/logo.png";
    }
    else if(this.scrolled && window.pageYOffset <= 100) {
        this.scrolled = false;
        this.logo = "../../../assets/logo-noir.png";
    }
  }

  selectArtiste(artiste : Artiste) {
    this.artisteFocused = artiste;
    this.descriptionOnFocus = artiste.description.split('\n');
  }

  selectAlbum(album : Album) {
    this.albumFocused = album;
  }

  selectCollab(collab: Collaborateur) {
    this.collabFocused = collab;
  }

  closeArtistePortfolio(){
    this.artisteFocused = null;
  }

  closeAlbumPortfolio(){
    this.albumFocused = null;
  }

  sanitizeUrl(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setOption(page: number) {
    this.option = page;
  }

  compareOrder(art1, art2) {
    if (art1.ordre > art2.ordre) {
      return 1;
    }
    if (art1.ordre < art2.ordre) {
      return -1;
    }
    return 0;
  }

}


