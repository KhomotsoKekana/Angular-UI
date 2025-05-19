import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IllustrationAiAssist } from '../../../../../ui/src/lib/illustrations/ai-assist.component';
import { IllustrationConversation } from '../../../../../ui/src/lib/illustrations/conversation-illustration.component';
import { CustomerProfileIllustration } from '../../../../../ui/src/lib/illustrations/customer-profile-illustration.component';
import { IllustrationNoData } from '../../../../../ui/src/lib/illustrations/no-data-illustration.component';
import { IllustrationServer } from '../../../../../ui/src/lib/illustrations/server-illustration.component';
import { IllustrationWarning } from '../../../../../ui/src/lib/illustrations/warning-illustration.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    IllustrationAiAssist,
    IllustrationConversation,
    CustomerProfileIllustration,
    IllustrationNoData,
    IllustrationServer,
    IllustrationWarning
  ],
  templateUrl: './illustrations.component.html',
})
export class DocsIllustrationsComponent {}
