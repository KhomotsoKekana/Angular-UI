import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-ill-conversation',
    imports:[CommonModule],
    standalone: true,
    templateUrl: './conversation-illustration.component.html'
})
export class IllustrationConversation {
    @Input() class: string = ''
}