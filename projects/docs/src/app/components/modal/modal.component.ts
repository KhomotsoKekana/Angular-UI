import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../ui/src/lib/modal/modal.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';

@Component({
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './modal.component.html',
})
export class DocsModalComponent {
  isBasicModalOpen = false;
  isSizesModalOpen = false;
  isCustomModalOpen = false;
  
  modalSize: 'sm' | 'md' | 'lg' = 'md';
  
  openBasicModal() {
    this.isBasicModalOpen = true;
  }
  
  openSizesModal(size: 'sm' | 'md' | 'lg') {
    this.modalSize = size;
    this.isSizesModalOpen = true;
  }
  
  openCustomModal() {
    this.isCustomModalOpen = true;
  }
}