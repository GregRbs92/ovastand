import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FileService } from '../../services/files.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  submitting: boolean = false;
  colors: {main_color: string, second_color: string} = {main_color: '', second_color: ''};

  constructor(private auth: AuthService, private router: Router, private fs: FileService) { }

  ngOnInit() {
    this.fs.getColors().subscribe(colors => {
      this.colors = colors;
    })
  }

  submit(username, password) {
    this.auth.login(username, password).subscribe(res => {
      if (res) {
        this.router.navigate(['/admin']);
      }
    }, err => {
      alert(err);
    });
  }

}
