import { DialogConfig, DialogRef } from "@angular/cdk/dialog";
import { CustomModalContainerComponent } from "./modal.component"
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PortalModule } from "@angular/cdk/portal";

fdescribe ('CustomModalContainerComponent', () => {
    let component : CustomModalContainerComponent;
    let fixture: ComponentFixture<CustomModalContainerComponent>;
    let testDialogRef : jasmine.SpyObj<DialogRef<any>>;

    beforeEach(() => {
        testDialogRef = jasmine.createSpyObj('DialogRef', ['close']);
        const dialogConfig: DialogConfig = {disableClose: false};
        TestBed.configureTestingModule({
            imports: [CustomModalContainerComponent, PortalModule],
            providers: [{provide : DialogRef, useValue : testDialogRef}, {provide : DialogConfig, useValue : dialogConfig}]
        });
        console.log("checking");

    fixture = TestBed.createComponent(CustomModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    });

    it('should close the dialog on close()', () => {
        component.close();
        expect(testDialogRef.close).toHaveBeenCalled();
    });
    it('should close the dialog on backdrop click', () => {
        component.onBackdropClick();
        expect(testDialogRef.close).toHaveBeenCalledWith('testing');
    });
    it('should not close dialog on backdrop click when disabled', () => {
    component.config.disableClose = true;
    component.onBackdropClick();
    expect(testDialogRef.close).not.toHaveBeenCalled();
  });

});
