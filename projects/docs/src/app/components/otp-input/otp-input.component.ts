import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtpInputComponent } from '../../../../../ui/src/lib/otp-input/otp-input.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, OtpInputComponent],
  templateUrl: './otp-input.component.html',
})
export class DocsOtpInputComponent {
  otpValue = '';
  otpValueWithPlaceholder = '';

  onOtpChange(value: string) {
    this.otpValue = value;
    console.log('OTP changed:', value);
  }

  onOtpChangeWithPlaceholder(value: string) {
    this.otpValueWithPlaceholder = value;
    console.log('OTP with placeholder changed:', value);
  }
}
