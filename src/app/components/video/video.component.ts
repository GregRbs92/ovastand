import { Component, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {

  @Input() src: string;
  @Input() poster: string;

  show: boolean = true;

  constructor() { }

  handleClick() {
    const v = $('video')[0];
    this.show ? v.play() : v.pause();
    this.show = !this.show;
  }

}
