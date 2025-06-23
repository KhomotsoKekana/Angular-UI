import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverComponent } from './popover.component';

describe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open popover', () => {
    spyOn(component.open,'emit');

    component.openPopover();

    expect(component.isOpenInternal).toBeTrue();
    expect(component.open.emit)
  });

  it('should close the popover', () => {
    spyOn(component.close, 'emit');

    component.closePopover();

    expect(component.isOpenInternal).toBeFalse();
    expect(component.close.emit).toHaveBeenCalled();
  });
  
  it('should confirm that correct default values are applied', () => {
    expect(component.placement).toBe('bottom');
    expect(component.showCloseButton).toBeFalse();
    expect(component.offset).toBe(10);
    expect(component.bgColor).toBe('#FFFFFF');
  });

  xit('should close popover when the backdrop is clicked', () => {
    spyOn(component,'closePopover');
    component.getOverlayRef().backdropClick().subscribe(() => {
      component.closePopover();
    });

    expect(component.closePopover).toHaveBeenCalled();
  })

});
