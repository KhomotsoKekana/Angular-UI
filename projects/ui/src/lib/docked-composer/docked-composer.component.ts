import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonComponent } from "../button/button.component";
import { IconComponent } from '../icons/icon.component';

@Component({
    selector: 'flex-docked-composer',
    imports: [CommonModule, IconComponent, DragDropModule, ButtonComponent],
    templateUrl: './docked-composer.component.html',
})
export class DockedComposerComponent {
    isFullScreen = false;
    isMinimized = false;
    @Input() isOpen = true;
    @Input() title = 'New Message';
    @Input() label = 'Customer'
    @Input() allowClose = true;
    @Input() allowResize = true;
    @Input() allowDrag = false;

    @Output() onClose = new EventEmitter<void>();

    // Drag Position
    posX = 0;
    posY = 0;

    toggleFullScreen() {
        this.isFullScreen = !this.isFullScreen;
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
    }

    close() {
        this.isOpen = false;
        this.onClose.emit();
    }

    dragEnd(event: any) {
        this.posX = event.source.getFreeDragPosition().x;
        this.posY = event.source.getFreeDragPosition().y;
    }

    get position() {
        return { x: this.posX, y: this.posY }
    }
}