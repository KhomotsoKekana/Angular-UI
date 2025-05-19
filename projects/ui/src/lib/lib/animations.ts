import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

// Fade In/Out Animation
export const fadeAnimation = trigger('fadeAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-out', style({ opacity: 0 }))
    ])
]);

// Slide In/Out Animation
export const slideAnimation = trigger('slideAnimation', [
    transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('300ms ease-out', style({ transform: 'translateX(100%)' }))
    ])
]);

// Scale Animation
export const scaleAnimation = trigger('scaleAnimation', [
    transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate(
            '300ms ease-out',
            style({ transform: 'scale(1)', opacity: 1 })
        )
    ]),
    transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate(
            '300ms ease-in',
            style({ transform: 'scale(0.5)', opacity: 0 })
        )
    ])
]);

// Additional animations can be added here as needed
export const modalAnimation = trigger('modalAnimation', [
    // Enter animation with a single bounce
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.9)' }), // Initial state: slightly smaller and invisible
      animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bezier curve for overshoot
        style({ opacity: 1, transform: 'scale(1)' })     // Final state: normal size and visible
      )
    ]),
    // Leave animation (smooth shrink and fade)
    transition(':leave', [
      animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)', // Standard smooth ease-out
        style({ opacity: 0, transform: 'scale(0.8)' }) // Final state: shrink and fade out
      )
    ]),
  ]);

export const backdropFade = trigger('backdropFade', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('150ms ease-out', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate('100ms ease-in', style({ opacity: 0 })),
    ]),
  ]);

export const modalFadeScale = trigger('modalFadeScale', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.95)' }),
      animate('200ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
    ]),
    transition(':leave', [
      animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
    ]),
  ]);

export const modalPopIn = trigger('modalPopIn', [
    transition(':enter', [
        animate(
            '250ms ease-in',
            keyframes([
                // Start small and invisible
                style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
                style({ transform: 'scale(0)', opacity: 0, offset: 0.2 }),
                // Grow quickly to almost full size
                // style({ transform: 'scale(1)', opacity: 0.9, offset: 0.6 }),
                // Slight overshoot (the single bounce)
                style({ transform: 'scale(1.05)', opacity: 1, offset: 0.5 }),
                // Settle at final size
                style({ transform: 'scale(1)', opacity: 1, offset: 1 })
            ])
        ),
    ]),
    transition(':leave', [
        animate(
            '200ms ease-out',
            style({ transform: 'scale(0.9)', opacity: 0 })
        ),
    ]),
]);

export const materialModal = trigger('materialModal', [
    transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('225ms cubic-bezier(0.0, 0.0, 0.2, 1)', 
            style({ opacity: 1, transform: 'scale(1)' })
        )
    ]),
    transition(':leave', [
        animate('195ms cubic-bezier(0.4, 0.0, 1, 1)', 
            style({ opacity: 0, transform: 'scale(0.95)' })
        )
    ])
]);