import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'flex-ill-customer-profile',
    imports:[CommonModule],
    standalone: true,
    templateUrl: './customer-profile-illustration.component.html'
})
export class CustomerProfileIllustration {
    @Input() class: string = ''
}