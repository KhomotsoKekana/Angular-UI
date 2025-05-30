import { Component } from '@angular/core';
import { AvatarComponent } from '../../../../../ui/src/lib/avatar/avatar.component';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  standalone: true,
  imports: [AvatarComponent, CodeBlockComponent,CodeBlockComponent],
  templateUrl: './avatar.component.html',
})
export class DocsAvatarComponent {}