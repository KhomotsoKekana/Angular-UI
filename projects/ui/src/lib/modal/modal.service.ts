import { ApplicationRef, ComponentRef, Injectable, Type, Injector, createComponent, EnvironmentInjector } from '@angular/core';
import { ModalComponent } from './modal.component';

export interface ModalConfig {
  disableClose?: boolean;
  data?: any;
  modalClass?: string;
  backdropVariant?: 'light' | 'dark';
  // additional config properties as needed
}

export class ModalRef<T = any> {
  public componentInstance: T;
  private _componentInstanceReady = false;
  private _onInstanceReadyCallbacks: ((instance: T) => void)[] = [];
  disableClose = false;

  constructor(
    private modalComponentRef: ComponentRef<ModalComponent>,
    private appRef: ApplicationRef
  ) {
    // Initialize with empty object
    this.componentInstance = {} as T;
  }

  // Method to set the component instance when ready
  _setComponentInstance(instance: T) {
    this.componentInstance = instance;
    this._componentInstanceReady = true;

    // Execute any callbacks waiting for the instance
    this._onInstanceReadyCallbacks.forEach(callback => callback(instance));
    this._onInstanceReadyCallbacks = [];
  }

  // Public method to execute code when component instance is ready
  onInstanceReady(callback: (instance: T) => void): void {
    if (this._componentInstanceReady) {
      callback(this.componentInstance);
    } else {
      this._onInstanceReadyCallbacks.push(callback);
    }
  }

  close() {
    // First set modal to not visible for animation
    this.modalComponentRef.instance.isOpen = false;

    // Use setTimeout to wait for animation to complete
    setTimeout(() => {
      // Clean up any subscriptions
      try {
        if (this.modalComponentRef.instance.isOpenChange) {
          this.modalComponentRef.instance.isOpenChange.unsubscribe();
        }
      } catch (e) {
        console.error('Error cleaning up modal subscriptions', e);
      }

      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();

      // Remove element from DOM
      if (this.modalComponentRef.location.nativeElement.parentNode) {
        document.body.removeChild(this.modalComponentRef.location.nativeElement);
      }
    }, 300); // Match the animation duration
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private injector: Injector, private appRef: ApplicationRef) { }

  open<T>(contentComponent: Type<T>, config?: ModalConfig): ModalRef<T> {
    try {
      // Create a ModalComponent dynamically using createComponent
      const modalComponentRef = createComponent(ModalComponent, {
        environmentInjector: this.injector as EnvironmentInjector
      });

      // Initially set isOpen to false for animation
      modalComponentRef.instance.isOpen = false;
      modalComponentRef.instance.contentComponent = contentComponent;

      // Attach the view manually
      this.appRef.attachView(modalComponentRef.hostView);

      // Create the ModalRef with proper generic type
      const modalRef = new ModalRef<T>(modalComponentRef, this.appRef);


      if (config?.data) {
        modalComponentRef.instance.data = config.data;
      }
      if (config?.disableClose !== undefined) {
        modalComponentRef.instance.allowClose = !config.disableClose;
        modalComponentRef.instance.closeOnBackdrop = !config.disableClose;
      }
      if (config?.modalClass !== undefined) {
        modalComponentRef.instance.modalClass = config.modalClass;
      }

      if (config?.backdropVariant !== undefined) {
        modalComponentRef.instance.backdropVariant = config.backdropVariant;
      }

      // Set up isOpenChange listener
      modalComponentRef.instance.isOpenChange.subscribe((isOpen: boolean) => {
        if (!isOpen) {
          modalRef.close();
        }
      });

      // Append modal component's host element to body
      document.body.appendChild(modalComponentRef.location.nativeElement);

      // Create the content component and pass data via direct assignment
      const contentComponentRef = createComponent(contentComponent, {
        environmentInjector: this.injector as EnvironmentInjector
      });
      if (config?.data) {
        (contentComponentRef.instance as any).data = config.data;
        // Object.assign(contentComponentRef.instance, config.data);
      }

      // Set the component instance on the modal reference
      modalRef._setComponentInstance(contentComponentRef.instance);

      // After view init, inject the component into the modal
      setTimeout(() => {
        if (modalComponentRef.instance.dynamicContent) {
          // Clear existing content and insert our pre-created component
          modalComponentRef.instance.dynamicContent.clear();
          modalComponentRef.instance.dynamicContent.insert(contentComponentRef.hostView);

          // Trigger animation after DOM update by increasing delay for smoother transition
          setTimeout(() => {
            modalComponentRef.instance.isOpen = true;
          }, 50); // increased delay from 10ms to 50ms
        }
      });

      return modalRef;
    } catch (error) {
      console.error('Error opening modal:', error);
      throw error
    }
  }
}
