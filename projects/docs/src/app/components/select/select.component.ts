import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectComponent } from '../../../../../ui/src/lib/select/select.component';
import { SelectItemComponent } from '../../../../../ui/src/lib/select/select-item.component';
import { SelectSectionComponent } from '../../../../../ui/src/lib/select/select-section.component';
import { SelectActionItemComponent } from '../../../../../ui/src/lib/select/select-action-item.component';
import { SelectRefactoredComponent } from '../../../../../ui/src/lib/select/select-refactored.component';
import { MultiSelectComponent } from '../../../../../ui/src/lib/select/multi-select.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SelectComponent, 
    SelectItemComponent, 
    SelectSectionComponent, 
    SelectActionItemComponent,
    SelectRefactoredComponent,
    MultiSelectComponent,
    ButtonComponent
  ],
  templateUrl: './select.component.html',
})
export class DocsSelectComponent {
  selectedOption: string | null = null;
  selectedMultiSelect: string[] = [];
  selectedSection: string | null = null;
  selectedSearchable: string | null = null;
  
  fruits = [
    { key: 'apple', label: 'Apple' },
    { key: 'banana', label: 'Banana' },
    { key: 'orange', label: 'Orange' },
    { key: 'strawberry', label: 'Strawberry' },
    { key: 'mango', label: 'Mango' }
  ];
  
  searchableItems = [
    { key: 'js', label: 'JavaScript' },
    { key: 'ts', label: 'TypeScript' },
    { key: 'py', label: 'Python' },
    { key: 'java', label: 'Java' },
    { key: 'cpp', label: 'C++' },
    { key: 'cs', label: 'C#' },
    { key: 'rb', label: 'Ruby' },
    { key: 'go', label: 'Go' }
  ];
  
  filteredItems = this.searchableItems;
  
  onSearchChange(searchQuery: string) {
    this.filteredItems = this.searchableItems.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  onSelectionChange(event: any) {
    console.log('Selection changed:', event);
  }
}