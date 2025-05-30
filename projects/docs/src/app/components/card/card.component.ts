import { Component } from '@angular/core';
import { CardComponent } from '../../../../../ui/src/lib/card/card.component';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  standalone: true,
  imports: [CardComponent, CommonModule, CodeBlockComponent],
  templateUrl: './card.component.html',
})
export class DocsCardComponent {}