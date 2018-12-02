import { Component, Input, Sanitizer } from '@angular/core';
import * as $ from 'jquery';
import { Artiste } from '../../interfaces/artiste';
import { ArtistesService } from '../../services/artistes.service';
import { url_api } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'edit-artistes',
  templateUrl: './edit-artistes.component.html',
  styleUrls: ['./edit-artistes.component.scss']
})
export class EditArtistesComponent {

  @Input()
  artistes: Artiste[];

  showModal: boolean = false;
  selectedArtiste: Artiste;
  action: string;
  accessToken: string = localStorage.getItem('accessToken');
  form_url: string = url_api + '/containers/artistes/upload?access_token=' + this.accessToken;

  constructor(private cdr: ChangeDetectorRef,private artisteProvider: ArtistesService) {

   }

  toggleModal(artiste, action) {
    this.action = action;
    this.selectedArtiste = artiste;
    this.showModal = !this.showModal;
  }

  deleteArtiste(idArtiste) {
    this.artisteProvider.deleteArtiste(idArtiste).subscribe(() => {
      this.artisteProvider.getArtistes().subscribe(data => {
        this.artistes = data.sort(this.compareOrder);
      });
    });
  }

  ajouterArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture, urlYt1, urlYt2, tourDates) {
    let p1 = photo_profil.files[0] ? photo_profil.files[0].name : '';
    let p2 = photo_couverture.files[0] ? photo_couverture.files[0].name : '';
    var ordre;
    if (p1) {
      this.artisteProvider.uploadPhoto(photo_profil.files[0]).subscribe();
    }
    if (p2) {
      this.artisteProvider.uploadPhoto(photo_couverture.files[0]).subscribe();
    }
    var tabDates = tourDates.split('\n');

    if (this.artistes)
         ordre = this.artistes.length + 1;
    else
        ordre = 1;

    this.artisteProvider.ajouterArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, p1, p2, ordre, urlYt1, urlYt2, tabDates).subscribe((artiste) => {
      this.showModal = false;
      this.artisteProvider.getArtistes().subscribe(data => {
        this.artistes = data.sort(this.compareOrder);
      });
    });
  }

  modifierArtiste(nom, genre, description, facebook, twitter, youtube, instagram, website, photo_profil, photo_couverture, urlYt1, urlYt2, tourDates) {
    let p1 = photo_profil.files[0] ? photo_profil.files[0].name : '';
    let p2 = photo_couverture.files[0] ? photo_couverture.files[0].name : '';
    if (p1) {
      this.artisteProvider.uploadPhoto(photo_profil.files[0]).subscribe();
    }
    if (p2) {
      this.artisteProvider.uploadPhoto(photo_couverture.files[0]).subscribe();
    }
    var tabDates = tourDates.split('\n');
    this.artisteProvider.modifierArtiste(this.selectedArtiste.id, nom, genre, description, facebook, twitter, youtube, instagram, website, p1, p2, urlYt1, urlYt2, tabDates).then((artiste) => {
      this.showModal = false;
      this.artisteProvider.getArtistes().subscribe(data => {
        this.artistes = data.sort(this.compareOrder);
      });
    });
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    var id = ev.path[0].childNodes[3].textContent;
    var ordre = ev.path[0].childNodes[1].textContent;
    ev.dataTransfer.setData("id", id);
    ev.dataTransfer.setData("ordre", ordre);
    
  }

  drop(ev) {
    ev.preventDefault();
    var idDropped = ev.dataTransfer.getData("id");
    var ordreDropped = ev.dataTransfer.getData("ordre");

    var idDroppedOn = ev.path[1].childNodes[3].textContent;
    var ordreDroppedOn = ev.path[1].childNodes[1].textContent;
    
    this.artisteProvider.setArtisteOrdre(idDropped, ordreDroppedOn);
    this.artisteProvider.setArtisteOrdre(idDroppedOn, ordreDropped);
    
    this.artisteProvider.getArtistes().subscribe(data => {
      this.artistes = data.sort(this.compareOrder);
    });
    
    this.cdr.detectChanges();
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

  tabToString(tab) {
      var r = tab.join('\n');
      return r;
  }
}

