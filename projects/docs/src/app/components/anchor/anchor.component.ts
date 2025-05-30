import { Component } from '@angular/core';
import { AnchorComponent } from '../../../../../ui/src/lib/anchor/anchor.component';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  standalone: true,
  imports: [AnchorComponent, CodeBlockComponent,CodeBlockComponent],
  templateUrl: './anchor.component.html',
})
export class DocsAnchorComponent {}
