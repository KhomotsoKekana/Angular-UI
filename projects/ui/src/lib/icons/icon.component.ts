import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconRegistryService } from './icon-registry.service';
import { ClassCombinePipe } from '../core/class-combine.pipe';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  providers: [ClassCombinePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnChanges {
  @Input() icon: string = '';
  @Input() class: string = 'h-6 w-6';
  @Input() color: string = 'currentColor';
  @Input() fill: string = 'none';
  // @Input() size: string = '24';
  @Input() strokeWidth: string = '1.25';

  iconHtml: SafeHtml = '';
  className: string = 'h-6 w-6 pointer-events-none';

  constructor(private sanitizer: DomSanitizer, private classCombinePipe: ClassCombinePipe, private iconRegistry: IconRegistryService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon']) {
      this.updateIconHtml();
    }

    if (changes['class']) {
      this.updateClassName();
    }
  }

  private updateIconHtml(): void {
    const path = this.iconRegistry.getIcon(this.icon);
    this.iconHtml = this.sanitizer.bypassSecurityTrustHtml(path);
  }

  private updateClassName(): void {
    const baseClass = "h-6 w-6 pointer-events-none";
    this.className = this.classCombinePipe.transform(baseClass, this.class);
  }
}
