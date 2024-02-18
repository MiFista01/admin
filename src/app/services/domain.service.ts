import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  constructor() { }
  private mainDomain: string = "";

  setMainDomain(domain: string): void {
    this.mainDomain = domain;
  }

  getMainDomain(): string {
    return this.mainDomain;
  }
}
