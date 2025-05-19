import { Component } from '@angular/core';
import { AccordionComponent } from '../../../../../ui/src/lib/accordion/accordion.component';
import { AccordionItemComponent } from '../../../../../ui/src/lib/accordion/accordion-item.component';

@Component({
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  templateUrl: './accordion.component.html',
})
export class DocsAccordionComponent {
}