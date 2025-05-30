import { Component } from '@angular/core';
import { AccordionComponent } from '../../../../../ui/src/lib/accordion/accordion.component';
import { AccordionItemComponent } from '../../../../../ui/src/lib/accordion/accordion-item.component';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent, CodeBlockComponent],
  templateUrl: './accordion.component.html',
})
export class DocsAccordionComponent {
}