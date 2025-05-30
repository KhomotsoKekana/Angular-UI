import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'flex-ill-no-data',
    imports:[CommonModule],
    standalone: true,
    templateUrl: './no-data-illustration.component.html'
})
export class IllustrationNoData {
    @Input() class: string = ''
    @Input() variant: 'primary' | 'secondary' = 'primary';

    // @HostBinding('class')
    // get hostClasses(): string {
    //     return `${this.class}`;
    // }
}