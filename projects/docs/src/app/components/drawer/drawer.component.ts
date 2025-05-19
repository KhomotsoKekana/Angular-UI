import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerComponent } from '../../../../../ui/src/lib/drawer/drawer.component';
import { ButtonComponent } from '../../../../../ui/src/public-api';
import { InputComponent } from '../../../../../ui/src/lib/input/input.component';

@Component({
  selector: 'app-drawer-docs',
  standalone: true,
  imports: [CommonModule, FormsModule, DrawerComponent, ButtonComponent, InputComponent],
  templateUrl: './drawer.component.html',
})
export class DrawerDocsComponent {
  // Right drawer
  rightDrawerOpen = false;
  
  // Left drawer
  leftDrawerOpen = false;
  
  // Top drawer
  topDrawerOpen = false;
  
  // Bottom drawer
  bottomDrawerOpen = false;
  
  // Resizable drawer
  resizableDrawerOpen = false;
  
  // Custom size drawer
  customSizeDrawerOpen = false;
  customSize = 450;
  
  // No backdrop drawer
  noBackdropDrawerOpen = false;
  
  // Form drawer
  formDrawerOpen = false;
  formName = '';
  formEmail = '';
  formMessage = '';
  
  toggleRightDrawer() {
    this.rightDrawerOpen = !this.rightDrawerOpen;
  }
  
  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
  
  toggleTopDrawer() {
    this.topDrawerOpen = !this.topDrawerOpen;
  }
  
  toggleBottomDrawer() {
    this.bottomDrawerOpen = !this.bottomDrawerOpen;
  }
  
  toggleResizableDrawer() {
    this.resizableDrawerOpen = !this.resizableDrawerOpen;
  }
  
  toggleCustomSizeDrawer() {
    this.customSizeDrawerOpen = !this.customSizeDrawerOpen;
  }
  
  toggleNoBackdropDrawer() {
    this.noBackdropDrawerOpen = !this.noBackdropDrawerOpen;
  }
  
  toggleFormDrawer() {
    this.formDrawerOpen = !this.formDrawerOpen;
  }
  
  submitForm() {
    // In a real application, this would submit the form data
    console.log('Form submitted', {
      name: this.formName,
      email: this.formEmail,
      message: this.formMessage
    });
    
    // Reset form and close drawer
    this.formName = '';
    this.formEmail = '';
    this.formMessage = '';
    this.formDrawerOpen = false;
  }
}