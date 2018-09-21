import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AdminComponent } from './pages/admin/admin.component';

import { AuthService } from './services/auth.service';
import { ArtistesService } from './services/artistes.service';
import { FileService } from './services/files.service';
import { PartenairesService } from './services/partenaires.service';

import { AuthGuard } from './guards/auth.guard';

import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { VideoComponent } from './components/video/video.component';
import { ProfilSettingsComponent } from './components/profil-settings/profil-settings.component';
import { PartenairesComponent } from './components/partenaires/partenaires.component';
import { EditArtistesComponent } from './components/edit-artistes/edit-artistes.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  maxScrollbarLength: 50,
  wheelSpeed: 0.2
};

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ConnexionComponent,
    AdminComponent,
    VideoComponent,
    ProfilSettingsComponent,
    PartenairesComponent,
    EditArtistesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    PerfectScrollbarModule,
    ScrollToModule.forRoot()
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AuthService,
    ArtistesService,
    FileService,
    PartenairesService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
