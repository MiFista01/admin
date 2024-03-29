import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StartDraggableDirective } from '@directives/start-draggable.directive';
import { DropzoneDirective } from '@directives/dropzone.directive';
import { MoveDraggabaleElementDirective } from '@directives/move-draggabale-element.directive';
import { ConstructorService } from '@services/constructor.service';
@Component({
  selector: 'app-constructor-element',
  standalone: true,
  imports: [
    CommonModule,
    StartDraggableDirective,
    DropzoneDirective,
    
  ],
  templateUrl: './constructor-element.component.html',
  styleUrl: './constructor-element.component.scss',
  // providers:[
  //   StartDraggableDirective,
  //   DropzoneDirective,
  //   MoveDraggabaleElementDirective
  // ]
})
export class ConstructorElementComponent {
  constructor(
    private constructorService: ConstructorService
  ){}
  @Input() element:any = {}
  onStartDrag(){
    this.constructorService.changeRightAsideStatus(false);
  }
}
