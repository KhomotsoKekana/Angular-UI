import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../ui/src/lib/modal/modal.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';
import { ModalHeaderComponent } from '../../../../../ui/src/lib/modal/v2/modal-header.component';
import { ModalFooterComponent } from '../../../../../ui/src/lib/modal/v2/modal-footer.component';
import { HeaderModule } from "../../../../../ui/src/lib/header/header.module";
import { ModalBodyComponent } from '../../../../../ui/src/lib/modal/v2/modal-body.component';
import { CustomDialogService } from '../../../../../ui/src/lib/modal/v2/modal.service';
import { SonnerService } from '../../../../../ui/src/lib/sonner/sonner.service';
import { IconComponent } from '../../../../../ui/src/lib/icons/icon.component';
import { ConfirmDeleteModalComponent } from './v2-components/delete-modal.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  imports: [CommonModule, ModalComponent, ButtonComponent, ModalBodyComponent, ModalHeaderComponent,
     ModalFooterComponent, HeaderModule,ModalComponent,IconComponent,CodeBlockComponent],
  templateUrl: './modal.component.html'
})
export class DocsModalComponent {
  isBasicModalOpen = false;
  isSizesModalOpen = false;
  isCustomModalOpen = false;

  showToast = false;
  private sonner = inject(SonnerService);
  
  constructor(private _modalServiceV2: CustomDialogService) {}

  openCustomModal() {
    this._modalServiceV2.open(ConfirmDeleteModalComponent).closed.subscribe(confirmed => {
      if (confirmed) {
        console.log('item deleted')
      }else {
        console.log('canceled')
      }
    }); 
  } 

  openBasicModal() {
    this.isBasicModalOpen = true;
  }

  close() {
  }

}