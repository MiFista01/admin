import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[ngMoveDraggabaleElement]',
  standalone: true
})
export class MoveDraggabaleElementDirective {

  constructor() { }
  
  @HostListener("mousemove",["$event"])
  onMoveElement(e:MouseEvent){
    // Получаем координаты мыши относительно окна браузера
    const cloneContainer = document.getElementById("clone-container") as HTMLElement;
    if(cloneContainer.firstElementChild != null){
      const mouseX = e.clientX;
      const mouseY = e.clientY;
  
      // Получаем координаты и размеры элемента
      const rect = cloneContainer.getBoundingClientRect();
      const elementX = rect.left + window.scrollX;
      const elementY = rect.top + window.scrollY;
  
      // Рассчитываем относительные координаты мыши внутри элемента
      const relativeX = mouseX - elementX;
      const relativeY = mouseY - elementY;
      const child = cloneContainer.firstElementChild as HTMLElement;
      const childRect = child.getBoundingClientRect();
      child.style.top = relativeY - childRect.height/2 + 'px';
      child.style.left = relativeX - childRect.width/2 + 'px';
    }
  }
}
