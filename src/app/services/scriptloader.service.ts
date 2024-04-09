import { Injectable } from '@angular/core';
declare function initDragDrop():void;
declare function initEditor():void 
@Injectable({
  providedIn: 'root'
})
export class ScriptloaderService {
  constructor() { }
  createConstructor(){
    initDragDrop()
    initEditor()
  }
}
