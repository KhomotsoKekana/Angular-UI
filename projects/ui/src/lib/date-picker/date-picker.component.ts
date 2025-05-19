import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output, ViewContainerRef, Input, ViewChild, ElementRef, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from "../input/input.component";
import { IconComponent } from '../icons/icon.component';

// Define interfaces for month display and day information
interface MonthDisplay {
    monthName: string;
    month: number;
    year: number;
    days: Day[];
}

interface Day {
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isSelectionStart: boolean;
    isSelectionEnd: boolean;
    isInRange: boolean;
}

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [CommonModule, ButtonComponent, IconComponent, TranslateModule, InputComponent],
    templateUrl: './date-picker.component.html',
})
export class DatePickerComponent implements OnInit, OnChanges {
    @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
    @Input() fromDate: Date | null = null;
    @Input() toDate: Date | null = null;
    @Input() showTimePicker: boolean = false; // Show time input fields
    @Output() dateRangeSelected = new EventEmitter<{ start: Date, end: Date }>();

    selectedDate: Date = new Date();
    activePreset: string = '';

    // Calendar display properties
    weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
    displayMonths: MonthDisplay[] = [];
    displayDate: Date = new Date();
    selectedRange: { start: Date | null, end: Date | null } = { start: null, end: null };
    isRangeSelection: boolean = true; // Set to true for range selection by default
    isDatePickerVisible: boolean = false;

    private overlayRef!: OverlayRef;

    @ViewChild('trigger') trigger!: ElementRef; // Reference to the trigger element
    @ViewChild('menu') menu!: TemplateRef<any>; // Reference to the dropdown menu

    constructor(
        private overlay: Overlay, private viewContainerRef: ViewContainerRef
    ) {

    }

    ngOnInit(): void {
        this.selectedDate = new Date();

        // If fromDate and toDate are provided, update selectedRange
        if (this.fromDate && this.toDate) {
            const newStart = new Date(this.fromDate);
            const newEnd = new Date(this.toDate);

            // If the new range doesn't match the existing selectedRange, set activePreset to 'custom'
            if (
                !this.selectedRange.start ||
                this.selectedRange.start.getTime() !== newStart.getTime() ||
                (this.selectedRange.end && this.selectedRange.end.getTime() !== newEnd.getTime())
            ) {


                this.activePreset = 'custom';
            }

            this.selectedRange = { start: newStart, end: newEnd };
            // Use the start date to update the display if needed
            this.displayDate = new Date(this.fromDate);
        }

        this.generateCalendarMonths();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['fromDate'] || changes['toDate']) {
            if (this.fromDate && this.toDate) {
                const newStart = new Date(this.fromDate);
                const newEnd = new Date(this.toDate);

                // If the new range doesn't match the existing selectedRange, set activePreset to 'custom'
                // !this.selectedRange.start ||
                //     this.selectedRange.start.getTime() !== newStart.getTime() ||
                //     (this.selectedRange.end && this.selectedRange.end.getTime() !== newEnd.getTime())
                if (
                    !this.selectedRange.start ||
                    !this.selectedRange.end ||
                    !this.isSameDay(this.selectedRange.start, newStart) ||
                    !this.isSameDay(this.selectedRange.end, newEnd)
                ) {

                    this.activePreset = 'custom';
                }

                this.selectedRange = { start: newStart, end: newEnd };
                this.displayDate = new Date(this.fromDate);
                this.generateCalendarMonths();
            }
        }
    }

    generateCalendarMonths(): void {
        this.displayMonths = [];
        // Generate current month
        const currentMonth = new Date(this.displayDate);
        this.displayMonths.push(this.generateMonthData(currentMonth));

        // Generate next month
        const nextMonth = new Date(this.displayDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.displayMonths.push(this.generateMonthData(nextMonth));
    }

    generateMonthData(date: Date): MonthDisplay {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Get the days from previous month to fill the first week
        const firstDayOfWeek = firstDay.getDay();
        const daysFromPrevMonth = firstDayOfWeek;

        // Get days from next month to fill the last week
        const lastDayOfWeek = lastDay.getDay();
        const daysFromNextMonth = 6 - lastDayOfWeek;

        // Create array to hold all days that will be displayed
        const days: Day[] = [];

        // Add days from previous month
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();

        for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
            const dayDate = new Date(year, month - 1, i);
            days.push(this.createDayObject(dayDate, false));
        }

        // Add days from current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayDate = new Date(year, month, i);
            days.push(this.createDayObject(dayDate, true));
        }

        // Add days from next month
        for (let i = 1; i <= daysFromNextMonth; i++) {
            const dayDate = new Date(year, month + 1, i);
            days.push(this.createDayObject(dayDate, false));
        }

        return {
            monthName: this.monthNames[month],
            month: month,
            year: year,
            days: days
        };
    }

    // createDayObject(date: Date, isCurrentMonth: boolean): Day {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);

    //     const isToday = date.getTime() === today.getTime();
    //     const isSelected = this.selectedDate && this.isSameDay(date, this.selectedDate);

    //     let isSelectionStart = false;
    //     let isSelectionEnd = false;
    //     let isInRange = false;

    //     if (this.selectedRange.start && this.isSameDay(date, this.selectedRange.start)) {
    //         isSelectionStart = true;
    //     }

    //     if (this.selectedRange.end && this.isSameDay(date, this.selectedRange.end)) {
    //         isSelectionEnd = true;
    //     }

    //     if (this.selectedRange.start && this.selectedRange.end) {
    //         isInRange = date >= this.selectedRange.start && date <= this.selectedRange.end;
    //     }

    //     return {
    //         date: date,
    //         dayNumber: date.getDate(),
    //         isCurrentMonth: isCurrentMonth,
    //         isToday: isToday,
    //         isSelected: isSelected,
    //         isSelectionStart: isSelectionStart,
    //         isSelectionEnd: isSelectionEnd,
    //         isInRange: isInRange
    //     };
    // }

    createDayObject(date: Date, isCurrentMonth: boolean): Day {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isToday = this.isSameDay(today, date);
        const isSelected = this.selectedDate && this.isSameDay(date, this.selectedDate);

        // Handle range selection properties
        let isSelectionStart = false;
        let isSelectionEnd = false;
        let isInRange = false;

        if (this.selectedRange.start && this.isSameDay(date, this.selectedRange.start)) {
            isSelectionStart = true;
        }

        if (this.selectedRange.end && this.isSameDay(date, this.selectedRange.end)) {
            isSelectionEnd = true;
        }

        if (this.selectedRange.start && this.selectedRange.end) {
            // Fix: Compare actual dates properly, not just timestamps
            const startTime = this.selectedRange.start.getTime();
            const endTime = this.selectedRange.end.getTime();
            const dateTime = date.getTime();

            isInRange = dateTime >= startTime && dateTime <= endTime;

            // If start and end are the same day, only mark the exact same date as in range
            if (this.isSameDay(this.selectedRange.start, this.selectedRange.end)) {
                isInRange = isSelectionStart || isSelectionEnd;
            }
        }

        return {
            date: date,
            dayNumber: date.getDate(),
            isCurrentMonth: isCurrentMonth,
            isToday: isToday,
            isSelected: isSelected,
            isSelectionStart: isSelectionStart,
            isSelectionEnd: isSelectionEnd,
            isInRange: isInRange
        };
    }

    isSameDay(date1: Date, date2: Date): boolean {

        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    navigatePrevMonth(calendarIndex: number): void {
        const newDate = new Date(this.displayDate);
        if (calendarIndex === 0) {
            newDate.setMonth(newDate.getMonth() - 1);
            this.displayDate = newDate;
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
            this.displayDate = newDate;
        }
        this.generateCalendarMonths();
    }

    navigateNextMonth(calendarIndex: number): void {
        const newDate = new Date(this.displayDate);
        if (calendarIndex === 1) {
            newDate.setMonth(newDate.getMonth() + 1);
            this.displayDate = newDate;
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
            this.displayDate = newDate;
        }
        this.generateCalendarMonths();
    }


    selectDate(day: Day): void {

        this.activePreset = 'custom';

        if (this.isRangeSelection) {
            this.handleRangeSelection(day.date);
        } else {
            this.selectedDate = day.date;
        }
        this.generateCalendarMonths();
    }

    handleRangeSelection(date: Date): void {
        if (!this.selectedRange.start || this.selectedRange.end) {
            // Start a new range selection
            this.selectedRange = { start: new Date(date), end: null };
        } else {
            // Complete the range selection
            this.selectedRange.end = new Date(date);
            if (this.selectedRange.end < this.selectedRange.start) {
                // Swap dates if end is before start
                [this.selectedRange.start, this.selectedRange.end] =
                    [this.selectedRange.end, this.selectedRange.start];
            }

            this.dateRangeSelected.emit({
                start: this.setToStartOfDay(this.selectedRange.start),
                end: this.setToEndOfDay(this.selectedRange.end)
            });
        }
        this.generateCalendarMonths();
    }

    formatDate(date: Date | null): string {
        if (!date) return '';

        // Format date part
        const dateStr = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

        // Check if time is set (non-zero hours, minutes, seconds)
        const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0;

        if (hasTime) {
            // Format time with hours and minutes
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 === 0 ? 12 : hours % 12;

            return `${dateStr} ${displayHours}:${minutes} ${period}`;
        }

        return dateStr;
    }

    updateStartDate(event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            this.selectedRange.start = date;
            this.generateCalendarMonths();
        }
    }

    updateStartTime(event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const timeParts = value.split(':');
        if (timeParts.length === 2) {
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const date = new Date(this.selectedRange.start!);
            date.setHours(hours, minutes, 0, 0);
            this.selectedRange.start = date;
            this.generateCalendarMonths();
            this.activePreset = 'custom';
        }
    }

    updateEndDate(event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            this.selectedRange.end = date;
            this.generateCalendarMonths();
        }
    }

    updateEndTime(event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const timeParts = value.split(':');
        if (timeParts.length === 2) {
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const date = new Date(this.selectedRange.end!);
            date.setHours(hours, minutes, 0, 0);
            this.selectedRange.end = date;
            this.generateCalendarMonths();
            this.activePreset = 'custom';
        }
    }

    cancelSelection(): void {
        this.selectedRange = { start: null, end: null };
        this.closeDatePicker();
        this.generateCalendarMonths();
    }

    applyDateRange(): void {
        if (this.selectedRange.start && this.selectedRange.end) {
            this.dateRangeSelected.emit({
                start: this.setToStartOfDay(this.selectedRange.start),
                end: this.setToEndOfDay(this.selectedRange.end)
            });
        }
    }

    private setDateRange(preset: string, startDate: Date, endDate: Date): void {
        this.activePreset = preset;
        this.selectedRange = { start: startDate, end: endDate };

        // Navigate to show the start date's month
        this.displayDate = new Date(startDate);
        this.generateCalendarMonths();

        // For hour-based presets, preserve the actual time
        const isHourBasedPreset = preset.toLowerCase().includes('hour');

        console.log('isHourBasedPreset', preset, startDate, endDate, isHourBasedPreset);

        this.dateRangeSelected.emit({
            start: isHourBasedPreset ? startDate : this.setToStartOfDay(startDate),
            end: isHourBasedPreset ? endDate : this.setToEndOfDay(endDate)
        });
    }

    selectLastHour(): void {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(today.getHours() - 1);
        this.setDateRange('lastHour', startDate, today);
    }

    selectLast6Hours(): void {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(today.getHours() - 6);
        this.setDateRange('last6Hours', startDate, today);
    }

    selectLast12Hours(): void {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(today.getHours() - 12);
        this.setDateRange('last12Hours', startDate, today);
    }

    selectToday(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.setDateRange('today', today, today);
    }

    selectYesterday(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        this.setDateRange('yesterday', startDate, startDate);
    }

    selectLast7Days(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        this.setDateRange('last7Days', startDate, today);
    }

    selectLast14Days(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 14);
        this.setDateRange('last14Days', startDate, today);
    }

    selectLast30Days(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        this.setDateRange('last30Days', startDate, today);
    }

    selectLast3Months(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        this.setDateRange('last3Months', startDate, today);
    }

    selectLast6Months(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        this.setDateRange('last6Months', startDate, today);
    }

    selectLast12Months(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 12);
        this.setDateRange('last12Months', startDate, today);
    }

    selectMonthToDate(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.setDateRange('monthToDate', startDate, today);
    }

    selectCustomRange(): void {
        this.activePreset = 'custom';
        this.isRangeSelection = true;
    }

    closeDatePicker() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null!;
            this.isDatePickerVisible = false;
        }
    }

    toggleDatePicker(): void {
        this.isDatePickerVisible = !this.isDatePickerVisible;

        if (this.overlayRef) {
            this.closeDatePicker();
            return;
        }

        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.trigger)
            .withPositions(this.getOverlayPosition());

        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            positionStrategy,
        });

        this.overlayRef.attach(new TemplatePortal(this.menu, this.viewContainerRef));

        this.overlayRef.backdropClick().subscribe(() => this.closeDatePicker());

    }

    formatDateRange(): string {
        if (!this.selectedRange.start || !this.selectedRange.end) return '';
        return `${this.formatDate(this.selectedRange.start)} - ${this.formatDate(this.selectedRange.end)}`;
    }

    private getOverlayPosition(): ConnectedPosition[] {
        return {
            bottom: [{ originX: 'center' as 'center', originY: 'bottom' as 'bottom', overlayX: 'center' as 'center', overlayY: 'top' as 'top' }],
            top: [{ originX: 'center' as 'center', originY: 'top' as 'top', overlayX: 'center' as 'center', overlayY: 'bottom' as 'bottom' }],
            left: [{ originX: 'start' as 'start', originY: 'center' as 'center', overlayX: 'end' as 'end', overlayY: 'center' as 'center' }],
            right: [{ originX: 'end' as 'end', originY: 'center' as 'center', overlayX: 'start' as 'start', overlayY: 'center' as 'center' }],
        }[this.placement];
    }

    private setToStartOfDay(date: Date): Date {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }

    private setToEndOfDay(date: Date): Date {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 59, 999);
        return newDate;
    }

    public formatTime(date: Date): string {
        if (!date) return '';

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }
}