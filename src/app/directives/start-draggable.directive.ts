import { Directive, ElementRef, EventEmitter, HostListener, Injector, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { ConstructorService } from '@services/constructor.service';

@Directive({
  selector: '[ngStartDraggable]',
  standalone: true
})
export class StartDraggableDirective {
  selectedElement = false
  constructor(private constructorService: ConstructorService){}
  @Output() onStartDrag = new EventEmitter();
  @HostListener('click', ['$event'])
  onDragStart(e:MouseEvent) {
    e.preventDefault()
    if(!this.selectedElement){
      this.selectedElement = true
      const clickedElement = e.currentTarget as HTMLElement
      setTimeout(() => {
        const container = document.getElementById("clone-container") as HTMLElement;
        if (container && clickedElement instanceof Node) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
          let element = clickedElement.cloneNode(true) as HTMLElement;
          if(!clickedElement.classList.value.split(" ").includes("prime")){
            element = clickedElement
          }
          element.classList.remove("prime");
    
          const mouseX = e.clientX;
          const mouseY = e.clientY;
      
          // Получаем координаты и размеры элемента
          const rect = container.getBoundingClientRect();
          const elementX = rect.left + window.scrollX;
          const elementY = rect.top + window.scrollY;
      
          // Рассчитываем относительные координаты мыши внутри элемента
          const relativeX = mouseX - elementX;
          const relativeY = mouseY - elementY;
          const childRect = element.getBoundingClientRect();
          element.style.top = relativeY - childRect.height/2 + 'px';
          element.style.left = relativeX - childRect.width/2 + 'px';
    
          container.appendChild(element);
          this.constructorService.changeRightAsideStatus(false)
          this.selectedElement = false
        }
      }, 10);
    }
  }
}
