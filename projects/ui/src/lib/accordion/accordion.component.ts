import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { ClassCombinePipe } from '../core/class-combine.pipe';

@Component({
  selector: 'flex-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  providers: [ClassCombinePipe]
})
export class AccordionComponent {


  constructor(
    private classCombinePipe: ClassCombinePipe
  ) {


  }
  @Input() class: string = ''; // Allow custom styles

  @HostBinding('class') get hostClasses(): string {

    return this.classCombinePipe.transform('flex flex-col gap-y-2', this.class);
  }

}
