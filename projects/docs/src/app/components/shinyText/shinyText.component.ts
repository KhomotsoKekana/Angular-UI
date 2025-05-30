import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShinyTextComponent } from '../../../../../ui/src/lib/shinyText/shinyText.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShinyTextComponent,CodeBlockComponent],
  templateUrl: './shinyText.component.html',
})
export class DocsShinyTextComponent {}
