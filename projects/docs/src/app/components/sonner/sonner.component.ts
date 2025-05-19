import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../../../../ui/src/lib/button/button.component";
import { SonnerService } from '../../../../../ui/src/lib/sonner/sonner.service';

@Component({
  selector: 'app-sonner',
  imports: [ButtonComponent],
  templateUrl: './sonner.component.html',
  styleUrl: './sonner.component.css'
})
export class DocsSonnerComponent {
  private sonner = inject(SonnerService);

  showSuccessMessage() {
    this.sonner.showSuccess('Operation successful', {
      description: 'Your data has been saved',
      closeButton: true,
      action: {
        label: 'Undo',
        onClick: () => alert('Undo'),
      },
    });
  }

  showErrorMessage() {
    this.sonner.showError('Error occurred', {
      description: 'Please try again later'
    }
    );
  }
}
