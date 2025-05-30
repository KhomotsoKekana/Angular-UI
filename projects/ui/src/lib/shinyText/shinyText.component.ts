import { Component, Input } from '@angular/core';

@Component({
  selector: 'flex-animated-shiny-text',
  template: `
    <span class="shiny-text {{ className }}">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .shiny-text {
      display: inline-block;
      position: relative;
      background: linear-gradient(90deg, white 0%, transparent 12.5%, white 25%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 3s linear forwards infinite;
    }

    @keyframes shine {
      0% { background-position: 100% 0%; }
      100% { background-position: -100% 0%; }
    }
  `]
})
export class ShinyTextComponent {
  @Input() className: string = '';
}
