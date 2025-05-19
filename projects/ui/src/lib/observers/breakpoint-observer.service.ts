import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg';

@Injectable({
    providedIn: 'root'
})
export class BreakpointObserverService implements OnDestroy {

    private breakpointObserverSub: Subscription | null = null;


    // Define breakpoint width thresholds
    private readonly breakpointValues = {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280
    };

    // Private subjects to track state
    private _breakpoint = new BehaviorSubject<Breakpoint>('lg');
    private _isMobile = new BehaviorSubject<boolean>(false);

    // Public observables
    readonly breakpoint$: Observable<Breakpoint> = this._breakpoint.asObservable();
    readonly isMobile$: Observable<boolean> = this._isMobile.asObservable();

    // Getter methods for current values
    get breakpoint(): Breakpoint {
        return this._breakpoint.value;
    }

    get isMobile(): boolean {
        return this._isMobile.value;
    }

    constructor(
        private breakpointObserver: BreakpointObserver
    ) {
        this.initialize();
    }

    private initialize(): void {
        // Setup the resize listener
        this.checkBreakpoint();

        this.breakpointObserverSub = this.breakpointObserver.observe([
            "(max-width: 768px)"
        ]).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.checkBreakpoint();
            } else {
                this.checkBreakpoint();
            }
        });
    }

    private checkBreakpoint(): void {
        const width = window.innerWidth;
        let newBreakpoint: Breakpoint;

        if (width < this.breakpointValues.sm) {
            newBreakpoint = 'xs';
        } else if (width < this.breakpointValues.md) {
            newBreakpoint = 'sm';
        } else if (width < this.breakpointValues.lg) {
            newBreakpoint = 'md';
        } else {
            newBreakpoint = 'lg';
        }

        // Only emit when the breakpoint changes
        if (this._breakpoint.value !== newBreakpoint) {
            this._breakpoint.next(newBreakpoint);
            // Consider 'xs' and 'sm' as mobile breakpoints
            this._isMobile.next(newBreakpoint === 'xs' || newBreakpoint === 'sm');
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from the breakpoint observer to prevent memory leaks
        if (this.breakpointObserverSub) {
            this.breakpointObserverSub.unsubscribe();
        }
    }
}