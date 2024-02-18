import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
  @Input() value = '';
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  deleteMe() {
    this.delete.emit({ name: this.value });
  }
}
