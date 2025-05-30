import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'flex-ill-server',
    imports:[CommonModule],
    standalone: true,
    templateUrl: './server-illustration.component.html'
})
export class IllustrationServer {
    @Input() class: string = ''
}