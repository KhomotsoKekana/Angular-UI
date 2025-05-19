import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';
import { ToggleButtonComponent } from '../../../../../ui/src/lib/button/toggle-button.component';
import { IconComponent } from '../../../../../ui/src/lib/icons/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ButtonComponent, ToggleButtonComponent, IconComponent, CommonModule],
  templateUrl: './button.component.html',
})
export class DocsButtonComponent {
  // Toggle button state properties
  favoriteToggle: boolean = false;
  playToggle: boolean = false;
  muteToggle: boolean = false;
  notificationToggle: boolean = true;
  
  // New feature toggle states
  singleVariantToggle: boolean = false;
  fullRoundedToggle: boolean = false;
  dangerToggle: boolean = false;
}
