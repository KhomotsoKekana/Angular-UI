import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerComponent } from '../../../../../ui/src/lib/divider/divider.component';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  standalone: true,
  imports: [CommonModule, DividerComponent, CodeBlockComponent],
  templateUrl: './divider.component.html',
})
export class DocsDividerComponent {}
