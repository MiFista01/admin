import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import videojs from 'video.js';
declare function initSwiper(swiper:any):void
@Component({
  selector: 'app-element',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss'
})
export class ElementComponent {
  @Input() element: any = {}
  @ViewChild('swiper', { static: false }) swiper!: ElementRef;
  @ViewChild('player', { static: false }) player!: ElementRef;
  playerOptions = {
    "aspectRatio":"16:9",
    "controls": "true", 
    "autoplay": "false",
    "preload": "auto"
  }
  ready = false
  ngOnInit() {
    switch (this.element.type) {
      case "swipers":
        this.element.properties.slides = JSON.parse(this.element.properties.slides)
        break;
      case "area":
        break
    }
  }
  ngAfterViewInit() {
    switch (this.element.type) {
      case "swipers":
        initSwiper(this.swiper.nativeElement)
        break;
      case "video":
        const videoPlayer = videojs(this.player.nativeElement, {
          controls: true,
          autoplay: false,
          preload: 'auto'
        });
        break;
    }
  }
}
