import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShinyTextComponent } from '../../../../../ui/src/lib/shinyText/shinyText.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShinyTextComponent],
  templateUrl: './shinyText.component.html',
})
export class DocsShinyTextComponent {}
