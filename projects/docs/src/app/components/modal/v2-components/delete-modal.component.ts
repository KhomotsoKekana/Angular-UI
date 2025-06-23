import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { ModalHeaderComponent } from '../../../../../../ui/src/lib/modal/v2/modal-header.component';
import { ModalBodyComponent } from '../../../../../../ui/src/lib/modal/v2/modal-body.component';
import { ModalFooterComponent } from '../../../../../../ui/src/lib/modal/v2/modal-footer.component';
import { ButtonComponent } from '../../../../../../ui/src/lib/button/button.component';
import { IconComponent } from '../../../../../../ui/src/lib/icons/icon.component'
import { SonnerService } from '../../../../../../ui/src/lib/sonner/sonner.service';

@Component({
  standalone: true,
  selector: 'flex-delete-modal',
  imports: [ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent,ButtonComponent,IconComponent],
  templateUrl: './delete-modal.component.html'
})
export class ConfirmDeleteModalComponent {
  private dialogRef = inject(DialogRef);
  private sonner = inject(SonnerService);

  cancel() {
    this.dialogRef.close(false);
  }

  deleteItem() {
  this.dialogRef.close(true);
  this.showSuccessMessage();
  }

  showSuccessMessage() {
    this.sonner.showSuccess('Deleted', {
      description: 'Item succesfully deleted',
      closeButton: true,
      action: {
        label: 'Close',
        onClick: () => console.log('closed'),
      },
    });
  }
}
