import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-ill-ai-assist',
    imports:[CommonModule],
    standalone: true,
    templateUrl: './ai-assist.component.html'
})
export class IllustrationAiAssist {
    @Input() class: string = ''
}