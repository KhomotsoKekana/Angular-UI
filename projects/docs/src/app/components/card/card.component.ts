import { Component } from '@angular/core';
import { CardComponent } from '../../../../../ui/src/lib/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './card.component.html',
})
export class DocsCardComponent {}