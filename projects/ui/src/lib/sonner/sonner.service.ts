import { Injectable, Injector, InputSignal, signal } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
// Fix the import to match the actual ngx-sonner exports
import { NgxSonnerToaster, Position, toast } from 'ngx-sonner';

export interface SonnerOptions {
  description?: string;
  duration?: number;
  position?: Position;
  richColors?: boolean;
  expand?: boolean;
  closeButton?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
  // Add any other options you want to support
}

export interface ToasterConfig {
  position?: Position;
  richColors?: boolean;
  expand?: boolean;
  closeButton?: boolean;
  duration?: number;
  // Add any other global configs
}

@Injectable({
  providedIn: 'root'
})
export class SonnerService {
  private overlayRef: OverlayRef | null = null;
  private config: ToasterConfig = {
    position: 'top-right',
    richColors: true,
    expand: false,
    closeButton: false,
    duration: 3000
  };

  constructor(private overlay: Overlay, private injector: Injector) {}

  setConfig(config: ToasterConfig) {
    this.config = { ...this.config, ...config };
    
    // If overlay already exists, dispose and recreate with new config
    if (this.overlayRef) {
      this.disposeOverlay();
    }
    
    this.createOverlay();
  }

  private createOverlay() {
    if (this.overlayRef) {
      return;
    }
    this.overlayRef = this.overlay.create({
      hasBackdrop: false
    });

    const portal = new ComponentPortal(NgxSonnerToaster, null, this.injector);
    const componentRef = this.overlayRef.attach(portal);

    componentRef.instance.richColors = signal(this.config.richColors ?? false) as any;
  
  }

  private getPositionStrategy(position: string) {
    const positionStrategy = this.overlay.position().global();
    
    switch (position) {
      case 'top-left':
        return positionStrategy.top('16px').left('16px');
      case 'top-right':
        return positionStrategy.top('16px').right('16px');
      case 'bottom-left':
        return positionStrategy.bottom('16px').left('16px');
      case 'bottom-right':
        return positionStrategy.bottom('16px').right('16px');
      case 'top-center':
        return positionStrategy.top('16px').centerHorizontally();
      case 'bottom-center':
        return positionStrategy.bottom('16px').centerHorizontally();
      default:
        return positionStrategy.top('16px').right('16px');
    }
  }

  private mergeOptions(options?: SonnerOptions): any {
    const defaultOptions = {
      duration: this.config.duration,
      richColors: this.config.richColors,
      closeButton: this.config.closeButton,
      expand: this.config.expand
    };

    return { ...defaultOptions, ...options };
  }

  showToast(message: string, options?: SonnerOptions): any {
    this.createOverlay();
    return toast(message, this.mergeOptions(options));
  }

  showSuccess(message: string, options?: SonnerOptions): any {
    this.createOverlay();
    return toast.success(message, this.mergeOptions(options));
  }

  showError(message: string, options?: SonnerOptions): any {
    this.createOverlay();
    return toast.error(message, this.mergeOptions(options));
  }

  showWarning(message: string, options?: SonnerOptions): any {
    this.createOverlay();
    return toast.warning(message, this.mergeOptions(options));
  }

  showInfo(message: string, options?: SonnerOptions): any {
    this.createOverlay();
    return toast.info(message, this.mergeOptions(options));
  }

  showPromise<T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
      description?: string;
    },
    toastOptions?: SonnerOptions
  ): any {
    this.createOverlay();
    return toast.promise(promise, options);
  }

  dismissAll() {
    toast.dismiss();
  }

  dismissToast(id: string | number) {
    toast.dismiss(id);
  }

  disposeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
