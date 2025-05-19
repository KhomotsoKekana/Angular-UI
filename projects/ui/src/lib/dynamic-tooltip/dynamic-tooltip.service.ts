import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  private activeTooltipId: string | null = null;
  private tooltipChange = new Subject<string | null>();
  
  tooltipChange$ = this.tooltipChange.asObservable();
  
  registerActiveTooltip(id: string): void {
    // If there's an active tooltip and it's different, notify it to close
    if (this.activeTooltipId && this.activeTooltipId !== id) {
      this.tooltipChange.next(this.activeTooltipId);
    }
    this.activeTooltipId = id;
  }
  
  deregisterActiveTooltip(id: string): void {
    if (this.activeTooltipId === id) {
      this.activeTooltipId = null;
    }
  }
}