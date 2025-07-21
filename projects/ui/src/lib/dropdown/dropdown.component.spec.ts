import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should clean up subscriptions on destroy', () => {
    component.ngAfterViewInit();
    const spy = jest.spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled(); // Ensure unsubscribe is called
  });
});
