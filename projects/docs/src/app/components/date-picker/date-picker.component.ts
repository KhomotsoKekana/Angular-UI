import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../../../../ui/src/lib/date-picker/date-picker.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DatePickerComponent,
    TranslateModule
  ],
  templateUrl: './date-picker.component.html',
})
export class DocsDatePickerComponent {
  // Selected date range for basic example
  basicFromDate: Date = new Date();
  basicToDate: Date = new Date();
  
  // Selected date range for time picker example
  timeFromDate: Date = new Date();
  timeToDate: Date = new Date();
  
  // Selected date range for placement example
  placementFromDate: Date = new Date();
  placementToDate: Date = new Date();
  selectedPlacement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  
  constructor(private translateService: TranslateService) {
    // Initialize the translation service with English as default
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    
    // Add translation entries for the date picker
    this.translateService.set('UI_LIB.DATE_PICKER', 'Date Range');
    this.translateService.set('UI_LIB.LAST_HOUR', 'Last hour');
    this.translateService.set('UI_LIB.LAST_SIX_HOURS', 'Last 6 hours');
    this.translateService.set('UI_LIB.LAST_TWELVE_HOURS', 'Last 12 hours');
    this.translateService.set('UI_LIB.TODAY', 'Today');
    this.translateService.set('UI_LIB.YESTERDAY', 'Yesterday');
    this.translateService.set('UI_LIB.LAST_SEVEN_DAYS', 'Last 7 days');
    this.translateService.set('UI_LIB.LAST_FOURTEEN_DAYS', 'Last 14 days');
    this.translateService.set('UI_LIB.LAST_THIRTY_DAYS', 'Last 30 days');
    this.translateService.set('UI_LIB.MONTH_TO_DATE', 'Month to date');
    this.translateService.set('UI_LIB.LAST_THREE_MONTHS', 'Last 3 months');
    this.translateService.set('UI_LIB.LAST_SIX_MONTHS', 'Last 6 months');
    this.translateService.set('UI_LIB.LAST_TWELVE_MONTHS', 'Last 12 months');
    this.translateService.set('UI_LIB.CUSTOM', 'Custom range');
    this.translateService.set('UI_LIB.START_TIME', 'Start time');
    this.translateService.set('UI_LIB.END_TIME', 'End time');
    this.translateService.set('UI_LIB.CANCEL', 'Cancel');
    this.translateService.set('UI_LIB.DONE', 'Done');

    // Set up date ranges for examples
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    
    this.basicFromDate = new Date(lastWeek);
    this.basicToDate = new Date(today);
    
    this.timeFromDate = new Date(lastWeek);
    this.timeToDate = new Date(today);
    
    this.placementFromDate = new Date(lastWeek);
    this.placementToDate = new Date(today);
  }
  
  // Handle selection in basic date picker
  onBasicDateRangeSelected(range: { start: Date, end: Date }) {
    this.basicFromDate = range.start;
    this.basicToDate = range.end;
    console.log('Basic date range selected:', range);
  }
  
  // Handle selection in time picker example
  onTimePickerDateRangeSelected(range: { start: Date, end: Date }) {
    this.timeFromDate = range.start;
    this.timeToDate = range.end;
    console.log('Time picker date range selected:', range);
  }
  
  // Handle selection in placement example
  onPlacementDateRangeSelected(range: { start: Date, end: Date }) {
    this.placementFromDate = range.start;
    this.placementToDate = range.end;
    console.log('Placement date range selected:', range);
  }
  
  // Format date for display
  formatDate(date: Date): string {
    return date ? 
      `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}` : 
      '';
  }
  
  // Format date with time for display
  formatDateWithTime(date: Date): string {
    if (!date) return '';
    
    const dateStr = this.formatDate(date);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    
    return `${dateStr} ${displayHours}:${minutes} ${period}`;
  }
}