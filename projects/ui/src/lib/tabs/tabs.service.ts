import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private activeTabSubject = new BehaviorSubject<string | null>(null);
  private focusTabSubject = new BehaviorSubject<string | null>(null);

  activeTab$ = this.activeTabSubject.asObservable();
  focusTab$ = this.focusTabSubject.asObservable();


  setActiveTab(label: string): void {
    // this.activeTabSubject.next(label);
    this.focusTabSubject.next(label);

  }

  setFocusTab(label: string): void {
    this.focusTabSubject.next(label);
  }
}