import { Component, OnInit } from '@angular/core';
import { PartenairesService } from '../../services/partenaires.service';
import { Partenaire } from '../../interfaces/partenaires';
import { HttpClient } from '@angular/common/http';
import { FileService } from '../../services/files.service';
import * as $ from 'jquery';
import { url_api } from '../../../environments/environment';

@Component({
  selector: 'partenaires',
  templateUrl: './partenaires.component.html',
  styleUrls: ['./partenaires.component.scss']
})
export class PartenairesComponent implements OnInit {

  partenaires : Partenaire[];
  showModal: boolean = false;
  selectedPartenaire: Partenaire;
  action : string;
  accessToken: string = localStorage.getItem('accessToken');
  formUrl: string = url_api + `/Containers/partenaires/upload?access_token=${this.accessToken}`;


  constructor(private http : HttpClient, private partenaireProvider : PartenairesService, private fs : FileService) { }

  ngOnInit() {
    $(window).resize(calculHeight);
    this.partenaireProvider.getPartenaires().subscribe(data => {
      this.partenaires = data;
      setTimeout(calculHeight, 0);
    });
  }

  toggleModal(partenaire, action) {
    this.action = action;
    this.selectedPartenaire = partenaire;
    this.showModal = !this.showModal;
  }

  ajouterPartenaire(nom, image, url) {
    let i = image.files[0] ? image.files[0].name : '';
    let url_logo = `${url_api}/Containers/partenaires/download/${i}`;
    this.partenaireProvider.uploadImage(image.files[0]).subscribe();

    this.partenaireProvider.ajouterPartenaire(nom, i, url_logo, url).subscribe(() => {
      this.showModal = false;
      this.partenaireProvider.getPartenaires().subscribe(data => {
        this.partenaires = data;
        setTimeout(calculHeight, 0);
      });
    });
  }

  deletePartenaire(id){
    this.partenaireProvider.deletePartenaire(id).subscribe(() => {
      this.partenaireProvider.getPartenaires().subscribe(data => {
        this.partenaires = data;
        setTimeout(calculHeight, 0);
      });
    });
  }
}

function calculHeight() {
  let partenaires = document.getElementsByClassName('partenaire');
  for (let i = 0; i < partenaires.length; i++) {
    let a = partenaires[i];
    let width = $(a).css('width');
    $(a).css("height", width);
  }

}
