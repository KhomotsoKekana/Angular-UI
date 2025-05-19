import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DropdownService {

    private dropdownClickedSubject = new BehaviorSubject<boolean | null>(null);

    dropdownClicked$ = this.dropdownClickedSubject.asObservable();


    onClick(label?: string): void {
        // this.activeTabSubject.next(label);
        this.dropdownClickedSubject.next(true);

    }

}