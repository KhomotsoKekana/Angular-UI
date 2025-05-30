import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'flex-ill-warning',
    imports:[CommonModule],
    standalone: true,
    templateUrl: './warning-illustration.component.html'
})
export class IllustrationWarning {
    @Input() class: string = ''
}