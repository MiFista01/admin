import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-constructor-element',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './constructor-element.component.html',
  styleUrl: './constructor-element.component.scss',
})
export class ConstructorElementComponent {
  constructor(
  ){}
  @Input() element:any = {}
  // ngOnInit(){
  //   console.log(this.element)
  // }
}
