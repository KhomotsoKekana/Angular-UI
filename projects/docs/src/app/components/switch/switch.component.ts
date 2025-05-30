import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from '../../../../../ui/src/lib/switch/switch.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  standalone: true,
  imports: [CommonModule, SwitchComponent,CodeBlockComponent],
  templateUrl: './switch.component.html',
})
export class DocsSwitchComponent {
  switchState1 = false;
  switchState2 = true;
  
  onSwitchChange(checked: boolean) {
    console.log('Switch toggled:', checked);
  }
}