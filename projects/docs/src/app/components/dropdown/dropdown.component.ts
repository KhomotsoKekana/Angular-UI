import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '../../../../../ui/src/lib/dropdown/dropdown.component';
import { DropdownTriggerComponent } from '../../../../../ui/src/lib/dropdown/dropdown-trigger.component';
import { DropdownMenuComponent } from '../../../../../ui/src/lib/dropdown/dropdown-menu.component';
import { DropdownItemComponent } from '../../../../../ui/src/lib/dropdown/dropdown-item.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';
import { IconComponent } from '../../../../../ui/src/lib/icons/icon.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DropdownComponent, 
    DropdownTriggerComponent, 
    DropdownMenuComponent,
    DropdownItemComponent,
    ButtonComponent,
    IconComponent
  ],
  templateUrl: './dropdown.component.html',
})
export class DocsDropdownComponent {
  // Selected option for basic dropdown
  selectedOption: string = 'Select an option';
  
  // Selected option for icon dropdown
  selectedIconOption: string = 'Select an option';
  
  // Selected placement option
  selectedPlacement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  
  // Sample items for dropdowns
  basicItems = [
    'Edit profile',
    'Settings',
    'Help',
    'Sign out'
  ];
  
  // Sample items with icons
  iconItems = [
    { label: 'Edit profile', icon: 'user' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Help', icon: 'helpCircle' },
    { label: 'Sign out', icon: 'logOut' }
  ];
  
  // Custom dropdown display
  roleItems = [
    { label: 'Admin', description: 'Full system access', active: true },
    { label: 'Editor', description: 'Can edit but not delete', active: false },
    { label: 'Viewer', description: 'Read-only access', active: false },
    { label: 'Guest', description: 'Limited access', active: false, disabled: true }
  ];
  
  selectedRole = 'Admin';
  
  // Handle selection in basic dropdown
  onSelectBasic(option: string): void {
    this.selectedOption = option;
  }
  
  // Handle selection in icon dropdown
  onSelectIconOption(option: string): void {
    this.selectedIconOption = option;
  }
  
  // Handle role selection
  onSelectRole(role: string): void {
    this.selectedRole = role;
    
    // Update active state
    this.roleItems = this.roleItems.map(item => ({
      ...item,
      active: item.label === role
    }));
  }
}