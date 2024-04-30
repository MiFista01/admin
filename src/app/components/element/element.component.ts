import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-element',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './element.component.html',
  styleUrl: './element.component.scss'
})
export class ElementComponent {
  @Input() element:any = {}
  ngOnInit(){
    console.log(this.element.properties.href)
  }
}
