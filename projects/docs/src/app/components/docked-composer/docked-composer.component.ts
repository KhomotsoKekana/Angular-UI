import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DockedComposerComponent } from '../../../../../ui/src/lib/docked-composer/docked-composer.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';
import { InputComponent } from '../../../../../ui/src/lib/input/input.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DockedComposerComponent,
    ButtonComponent,
    InputComponent
  ],
  templateUrl: './docked-composer.component.html',
})
export class DocsDockedComposerComponent {
  // Basic example
  basicOpen = false;
  basicTitle = 'New Message';
  
  // Custom content example
  customOpen = false;
  customTitle = 'Email Composer';
  emailTo = '';
  emailSubject = '';
  emailBody = '';
  
  // Draggable example
  draggableOpen = false;
  draggableTitle = 'Draggable Composer';
  
  // Multiple composers example
  composer1Open = false;
  composer2Open = false;
  composer3Open = false;
  
  toggleBasicComposer() {
    this.basicOpen = !this.basicOpen;
  }
  
  toggleCustomComposer() {
    this.customOpen = !this.customOpen;
    // Reset form when opening
    if (this.customOpen) {
      this.emailTo = '';
      this.emailSubject = '';
      this.emailBody = '';
    }
  }
  
  toggleDraggableComposer() {
    this.draggableOpen = !this.draggableOpen;
  }
  
  toggleComposer1() {
    this.composer1Open = !this.composer1Open;
  }
  
  toggleComposer2() {
    this.composer2Open = !this.composer2Open;
  }
  
  toggleComposer3() {
    this.composer3Open = !this.composer3Open;
  }
  
  openAllComposers() {
    this.composer1Open = true;
    this.composer2Open = true;
    this.composer3Open = true;
  }
  
  closeAllComposers() {
    this.composer1Open = false;
    this.composer2Open = false;
    this.composer3Open = false;
  }
  
  handleComposerClose(composerNumber: number) {
    if (composerNumber === 1) {
      this.composer1Open = false;
    } else if (composerNumber === 2) {
      this.composer2Open = false;
    } else if (composerNumber === 3) {
      this.composer3Open = false;
    }
  }
  
  sendEmail() {
    alert(`Email to ${this.emailTo} with subject "${this.emailSubject}" would be sent.`);
    this.customOpen = false;
  }
}