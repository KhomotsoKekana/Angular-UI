import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  SelectItemComponent,
  SelectSectionComponent,
  SelectRefactoredComponent,
  MultiSelectComponent
} from '../../../../../ui/src/lib/select';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  selector: 'flex-multi-select-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectItemComponent,
    SelectSectionComponent,
    SelectRefactoredComponent,
    MultiSelectComponent,
    ButtonComponent,
    CodeBlockComponent
  ],
  template: `
    <div class="p-6 space-y-4">
      <h1 class="text-xl font-semibold">Multi-Select Component</h1>
      <p class="mb-4">A dropdown component that allows users to select multiple values from a list.</p>

      <!-- Basic Multi-Select -->
      <h2 class="text-lg font-medium mb-2">Basic Multi-Select</h2>
      <div class="max-w-md mb-6">
        <flex-multi-select [(ngModel)]="selectedLanguages" placeholder="Select languages" label="Programming Languages">
          <flex-select-item *ngFor="let lang of languages" [key]="lang.key">
            {{ lang.label }}
          </flex-select-item>
        </flex-multi-select>
        <p class="mt-2 text-sm text-gray-600">
          Selected values: {{ selectedLanguages.length ? selectedLanguages.join(', ') : 'None' }}
        </p>
      </div>

      <!-- Limited Selection -->
      <h2 class="text-lg font-medium mb-2">Limited Selection</h2>
      <div class="max-w-md mb-6">
        <flex-multi-select
          [(ngModel)]="limitedSelection"
          [maxSelection]="2"
          placeholder="Select up to 2 languages"
          label="Limited Selection">
          <flex-select-item *ngFor="let lang of languages" [key]="lang.key">
            {{ lang.label }}
          </flex-select-item>
        </flex-multi-select>
        <p class="mt-2 text-sm text-gray-600">
          Selected values: {{ limitedSelection.length ? limitedSelection.join(', ') : 'None' }}
        </p>
      </div>

      <!-- With Sections -->
      <h2 class="text-lg font-medium mb-2">With Sections</h2>
      <div class="max-w-md mb-6">
        <flex-multi-select [(ngModel)]="selectedTechs" placeholder="Select technologies" label="Tech Stack">
          <flex-select-section *ngFor="let category of categories" [title]="category.title">
            <flex-select-item *ngFor="let item of category.items" [key]="item.key">
              {{ item.label }}
            </flex-select-item>
          </flex-select-section>
        </flex-multi-select>
        <p class="mt-2 text-sm text-gray-600">
          Selected values: {{ selectedTechs.length ? selectedTechs.join(', ') : 'None' }}
        </p>
      </div>

      <!-- Reactive Forms Example -->
      <h2 class="text-lg font-medium mb-2">Reactive Forms Example</h2>
      <div class="max-w-md mb-6 p-4 border border-gray-200 rounded">
        <form [formGroup]="techForm" (ngSubmit)="onSubmitForm()">
          <flex-multi-select
            formControlName="technologies"
            label="Technologies"
            placeholder="Select technologies">
            <flex-select-item *ngFor="let lang of languages" [key]="lang.key">
              {{ lang.label }}
            </flex-select-item>
          </flex-multi-select>
          <div class="mt-4">
            <flex-button type="submit" [disabled]="!techForm.valid">
              Submit
            </flex-button>
          </div>
        </form>
        <div *ngIf="submitted" class="mt-4 p-3 bg-green-100 text-green-800 rounded">
          Form submitted with: {{ formValues }}
        </div>
      </div>
    </div>
  `,
})
export class MultiSelectDemoComponent {
  // Selected values
  selectedLanguages: string[] = [];
  limitedSelection: string[] = [];
  selectedTechs: string[] = [];
  
  // Form values
  techForm: FormGroup;
  submitted = false;
  formValues = '';
  
  // Data
  languages = [
    { key: 'typescript', label: 'TypeScript' },
    { key: 'javascript', label: 'JavaScript' },
    { key: 'python', label: 'Python' },
    { key: 'java', label: 'Java' },
    { key: 'csharp', label: 'C#' },
    { key: 'rust', label: 'Rust' }
  ];
  
  categories = [
    {
      title: 'Frontend',
      items: [
        { key: 'html', label: 'HTML' },
        { key: 'css', label: 'CSS' },
        { key: 'js', label: 'JavaScript' }
      ]
    },
    {
      title: 'Backend',
      items: [
        { key: 'nodejs', label: 'Node.js' },
        { key: 'python', label: 'Python' },
        { key: 'java', label: 'Java' }
      ]
    },
    {
      title: 'Database',
      items: [
        { key: 'mongodb', label: 'MongoDB' },
        { key: 'mysql', label: 'MySQL' },
        { key: 'postgres', label: 'PostgreSQL' }
      ]
    }
  ];
  
  constructor(private fb: FormBuilder) {
    this.techForm = this.fb.group({
      technologies: [['typescript'], Validators.required]
    });
  }
  
  onSubmitForm() {
    this.submitted = true;
    this.formValues = JSON.stringify(this.techForm.value);
    console.log('Form values:', this.techForm.value);
  }
}
