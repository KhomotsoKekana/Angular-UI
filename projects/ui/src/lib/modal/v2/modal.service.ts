// src/app/services/custom-modal.service.ts
import { Injectable, Type } from '@angular/core'; // Import Type
import { Dialog, DialogRef, DialogConfig } from '@angular/cdk/dialog';
import { CustomModalContainerComponent } from './modal.component';

// Import your custom container - this remains constant for this service

// Define a more generic type for options, excluding component-specific parts
export type GenericModalOptions<D = any> = Omit<DialogConfig<D>, 'data' | 'container' | 'component'>;

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {

  constructor(private dialog: Dialog) { }

  /**
   * Opens a modal using the custom container with the specified component, data, and optional configuration.
   * @param component The component type (<C>) to render inside the modal.
   * @param data The data (<D>) to pass to the component instance. Can be undefined if not needed.
   * @param options Optional configuration overrides (e.g., width, height, disableClose).
   * @returns A DialogRef<R, C> instance for interacting with the opened modal. R is the expected result type on close.
   */
  open<R = any, D = any, C = any>( // Added generics R (Result), D (Data), C (Component)
    component: Type<C>,            // Accept the component type
    data?: D,                      // Data is now optional and generic
    options?: GenericModalOptions<D> // Use generic options type
  ): DialogRef<R, C> {             // Return type uses generics

    // --- Define Default Configuration (can still have some) ---
    const defaultConfig: DialogConfig<D> = {
      width: '500px',
      disableClose: false,
      hasBackdrop: true,
      // Add other general defaults if needed
    };

    // --- Prepare the final configuration ---
    // const finalConfig: DialogConfig<D, DialogRef<R, C>> = {
    const finalConfig: DialogConfig<D, any> = {
      ...defaultConfig,
      ...options,
      // --- Key parts handled by the service ---
      data: data,                               // Pass the generic data
      container: CustomModalContainerComponent, // **Still enforces your custom container**
    };

    // --- Open the Dialog using the passed component type ---
    const dialogRef = this.dialog.open<R, D, C>( // Use all generics here
      component,          // Pass the dynamic component type
      finalConfig
    );

    return dialogRef;
  }
}