import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerComponent } from './drawer.component';

describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the drawer when the escape button is pressed', ()=> {
    component.isOpen = true;
    spyOn(component.closeDrawer, 'emit');
    const event = new KeyboardEvent('keydown', {key: 'Escape'});
    document.dispatchEvent(event);

    expect(component.isOpen).toBeFalse();
    expect(component.closeDrawer.emit).toHaveBeenCalled();
  });

  it('should emit closeDrawer when close() is called', ()=> {
    spyOn(component.closeDrawer, 'emit');
    component.close();
    expect(component.isOpen).toBeFalse();
    expect(component.closeDrawer.emit).toHaveBeenCalled();
  });

  it('should return correct transform based on direction', ()=> {
    expect(component.getTransform('top')).toBe('translateY(-100%)');
    expect(component.getTransform('bottom')).toBe('translateY(100%)');
    expect(component.getTransform('left')).toBe('translateX(-100%)');
    expect(component.getTransform('right')).toBe('translateX(100%)');
  });



});
