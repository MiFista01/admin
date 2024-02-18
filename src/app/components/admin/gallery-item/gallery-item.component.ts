import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gallery-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.scss'
})
export class GalleryItemComponent {
  @Input() src = ""
  @Output() toggleAsideEvent = new EventEmitter<string>();
  toggleAside() {
    this.toggleAsideEvent.emit(this.src);
  }
}
