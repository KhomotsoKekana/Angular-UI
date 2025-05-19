import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsSonnerComponent } from './sonner.component';

describe('SonnerComponent', () => {
  let component: DocsSonnerComponent;
  let fixture: ComponentFixture<DocsSonnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsSonnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsSonnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
