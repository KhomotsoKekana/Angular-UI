# Aheeva Flex UI Components

This document provides a high-level overview of all the UI components available in the Aheeva Flex UI library.

## Table of Contents

- [Aheeva Flex UI Components](#aheeva-flex-ui-components)
  - [Table of Contents](#table-of-contents)
  - [Layout Components](#layout-components)
    - [Accordion](#accordion)
    - [Card](#card)
    - [Divider](#divider)
    - [Drawer](#drawer)
    - [Docked Composer](#docked-composer)
    - [Header](#header)
    - [Main Sidebar](#main-sidebar)
    - [Secondary Sidebar](#secondary-sidebar)
    - [Modal](#modal)
    - [Tabs](#tabs)
  - [Form Components](#form-components)
    - [Button](#button)
    - [Checkbox](#checkbox)
    - [Date Picker](#date-picker)
    - [Input](#input)
    - [OTP Input](#otp-input)
    - [Radio Group](#radio-group)
    - [Select](#select)
    - [Switch](#switch)
  - [Data Display Components](#data-display-components)
    - [Avatar](#avatar)
    - [Badge](#badge)
    - [Chart](#chart)
    - [Data Table](#data-table)
    - [Paginator](#paginator)
  - [Feedback Components](#feedback-components)
    - [Sonner](#sonner)
    - [Spinner](#spinner)
    - [Skeleton](#skeleton)
  - [Overlay Components](#overlay-components)
    - [Popover](#popover)
    - [Tooltip](#tooltip)
    - [Dynamic Tooltip](#dynamic-tooltip)
  - [Illustrations](#illustrations)

## Layout Components

### Accordion

An expandable/collapsible container component for organizing content into sections.

**Selector:** `app-accordion`

**Properties:**
- `class: string` - Custom CSS classes to apply to the accordion

**Child Component:** `AccordionItemComponent`
- Used within the accordion to create individual expandable sections

### Card

A versatile container component for displaying content in a card format.

**Selector:** `app-card`

**Properties:**
- `class: string` - Custom CSS classes to apply to the card

**Child Components:**
- `CardHeaderComponent` - Header section of the card
- `CardTitleComponent` - Title section within the card header
- `CardContentComponent` - Main content area of the card
- `CardFooterComponent` - Footer section of the card

### Divider

A simple separator component for creating visual divisions between content.

**Selector:** `app-divider`

**Properties:**
- `orientation: 'horizontal' | 'vertical'` - The orientation of the divider (default: 'horizontal')
- `color: string` - The color of the divider (default: 'rgba(0, 0, 0, 0.1)')
- `class: string` - Custom CSS classes to apply to the divider

### Drawer

A versatile slide-in panel component that can appear from any edge of the screen.

**Selector:** `app-drawer`

**Properties:**
- `isOpen: boolean` - Controls the visibility of the drawer (default: false)
- `position: 'top' | 'bottom' | 'left' | 'right'` - Determines which side of the screen the drawer appears from (default: 'right')
- `size: number` - Width/height of the drawer in pixels (default: 400)
- `resizable: boolean` - Whether the drawer can be resized by dragging (default: false)
- `showBackdrop: boolean` - Whether to show a backdrop behind the drawer (default: true)
- `preload: boolean` - Whether to preload the drawer content (default: false)

**Events:**
- `closeDrawer: EventEmitter<void>` - Emitted when the drawer is closed via close button, backdrop click, or Escape key

### Docked Composer

A versatile floating panel component that can be docked at the bottom of the screen.

**Selector:** `app-docked-composer`

**Properties:**
- `isOpen: boolean` - Controls the visibility of the composer (default: true)
- `title: string` - Title displayed in the header of the composer (default: 'New Message')
- `label: string` - Secondary label for additional context (default: 'Customer')
- `allowClose: boolean` - Whether to show the close button (default: true)
- `allowResize: boolean` - Whether to allow minimizing/maximizing the composer (default: true)
- `allowDrag: boolean` - Whether the composer can be dragged around by its header (default: false)

**Events:**
- `onClose: EventEmitter<void>` - Emitted when the close button is clicked

### Header

A versatile header component for application navigation and context display.

**Selector:** `app-header-component`

**Properties:**
- `class: string` - Custom CSS classes to apply to the header

**Child Components:**
- `HeaderLeftComponent` - Content for the left section of the header
- `HeaderRightComponent` - Content for the right section of the header

### Main Sidebar

A primary navigation sidebar component.

**Selector:** `app-main-sidebar`

**Properties:**
- `navItems: MainSidebarItem[]` - Array of navigation items to display
- `expanded: boolean` - Whether the sidebar is expanded or collapsed (default: true)
- `minWidth: number` - Minimum width of the sidebar when collapsed (default: 64)
- `maxWidth: number` - Maximum width of the sidebar when expanded (default: 260)

**Events:**
- `widthChange: EventEmitter<number>` - Emitted when the sidebar width changes

**Interface: MainSidebarItem**
- `title: string` - Text label for the navigation item
- `url: string` - URL/route for the navigation item
- `icon: string` - Icon name to display for the item
- `isActive: boolean` - Whether the navigation item is currently active
- `subItems?: MainSidebarItem[]` - Optional array of nested navigation items

### Secondary Sidebar

A secondary navigation sidebar component for sub-navigation.

**Selector:** `app-secondary-sidebar`

**Properties:**
- Similar to Main Sidebar, with different styling and positioning

### Modal

A dialog component for displaying content that requires user interaction.

**Selector:** `app-modal`

**Properties:**
- Various properties for controlling size, positioning, and behavior of the modal

## Form Components

### Button

A customizable button component.

**Selector:** `flex-button`

**Properties:**
- `variant: 'default' | 'primary' | 'primaryGhost' | 'secondary' | 'neutral' | 'ghost' | 'outline' | 'danger' | 'warning' | 'success'` - Button style variant (default: 'default')
- `size: 'xs' | 'small' | 'medium' | 'large'` - Button size (default: 'small')
- `disabled: boolean` - Whether the button is disabled (default: false)
- `loading: boolean` - Whether the button is in loading state (default: false)
- `class: string` - Custom CSS classes to apply to the button
- `buttonContentPosition: 'start' | 'center' | 'end'` - Alignment of button content (default: 'center')
- `type: 'button' | 'submit' | 'reset'` - HTML button type (default: 'button')

### Checkbox

A form control component for boolean input.

**Selector:** `app-checkbox`

**Properties:**
- `checked: boolean` - Whether the checkbox is checked (default: false)
- `disabled: boolean` - Whether the checkbox is disabled (default: false)
- `label: string` - Label text for the checkbox

**Events:**
- `change: EventEmitter<{checked: boolean}>` - Emitted when the checkbox state changes

### Date Picker

A form control for selecting dates.

**Selector:** `app-date-picker`

**Properties:**
- Various properties for date selection, formatting, and display

### Input

A versatile form input component.

**Selector:** `app-input`

**Properties:**
- `label: string` - The label text for the input (default: '')
- `type: string` - HTML input type (text, password, email, number, date, etc.) (default: 'text')
- `placeholder: string` - Placeholder text when the input is empty (default: '')
- `value: string | number | Date` - Current input value, supports two-way binding (default: '')
- `disabled: boolean` - Whether the input is disabled (default: false)
- `error: string | null` - Error message to display below the input (default: null)
- `leadingIcon: string | null` - Icon name to show at the start of the input (default: null)
- `leadingText: string | null` - Text to display at the start of the input (default: null)
- `trailingIcon: string | null` - Icon name to show at the end of the input (default: null)
- `trailingButton: string | null` - Text for a button to show at the end of the input (default: null)
- `enablePasswordReveal: boolean` - Whether to show a button to toggle password visibility (default: false)
- `regex: {regex: string, message: string}` - Regular expression validation with error message

**Events:**
- Input events for change, focus, blur

### OTP Input

A form control for entering One-Time Passwords.

**Selector:** `app-otp-input`

**Properties:**
- `length: number` - The number of input fields for the OTP (default: 6)
- `disabled: boolean` - Whether the OTP input is disabled (default: false)
- `placeholder: string` - Placeholder character for empty inputs (default: '')
- `className: string` - Custom CSS class for the component (default: '')

**Events:**
- `otpChange: EventEmitter<string>` - Emitted when the OTP value changes

### Radio Group

A form control component for selecting one option from a set of options.

**Selector:** `app-radio-group`

**Properties:**
- `value: any` - Selected value

**Events:**
- `valueChange: EventEmitter<any>` - Emit changes to parent

### Select

A dropdown selection component.

**Selector:** `app-select`

**Properties:**
- `placeholder: string` - Text displayed when no item is selected (default: 'Select an option')
- `enableSearch: boolean` - Enables the search bar (default: false)
- `isDynamicSearch: boolean` - Enables dynamic search (default: false)
- `loading: boolean` - Loading state (default: false)
- `disabled: boolean` - Disables the dropdown (default: false)
- `innerClass: string` - Inner class (default: '')
- `icon: string` - Icon name (default: '')
- `placement: 'top' | 'bottom' | 'left' | 'right'` - Dropdown position (default: 'bottom')

**Events:**
- `selectionChange: EventEmitter<any>` - Emitted when an item is selected
- `searchValueChange: EventEmitter<string>` - Emitted when the search input changes
- `change: EventEmitter<any>` - Emitted when selection changes
- `onClose: EventEmitter<void>` - Emitted when dropdown closes

**Child Components:**
- `SelectItemComponent` - Individual items in the dropdown
- `SelectSectionComponent` - Grouping section for items
- `SelectActionItemComponent` - Action items in the dropdown

### Switch

A toggle switch component.

**Selector:** `app-switch`

**Properties:**
- `checked: boolean` - Switch state (default: false)
- `disabled: boolean` - Disable interaction (default: false)

**Events:**
- `checkedChange: EventEmitter<boolean>` - Emitted when the switch state changes

## Data Display Components

### Avatar

A component for displaying user avatars.

**Selector:** `app-avatar`

**Properties:**
- Various properties for avatar display and styling

### Badge

A component for displaying notification counts or status indicators.

**Selector:** `app-badge`

**Properties:**
- Various properties for badge display and styling

### Chart

A data visualization component.

**Selector:** `app-chart`

**Properties:**
- Various properties for chart configuration and data display

### Data Table

A component for displaying tabular data.

**Selector:** `app-data-table`

**Properties:**
- Various properties for data display, sorting, pagination, etc.

### Paginator

A component for navigating through multi-page content.

**Selector:** `app-paginator`

**Properties:**
- Various properties for pagination configuration

## Feedback Components

### Sonner

A toast notification component.

**Selector:** `flex-sonner`

**Service:** `SonnerService`

**Methods:**
- Various methods for displaying different types of toast notifications

### Spinner

A loading indicator component.

**Selector:** `app-spinner`

**Properties:**
- Various properties for spinner size and appearance

### Skeleton

A placeholder loading component.

**Selector:** `app-skeleton`

**Properties:**
- Various properties for skeleton size and appearance

## Overlay Components

### Popover

A floating content container.

**Selector:** `app-popover`

**Properties:**
- Various properties for popover placement and behavior

### Tooltip

A simple text tooltip component.

**Selector:** `app-tooltip`

**Properties:**
- Various properties for tooltip content and placement

### Dynamic Tooltip

An enhanced tooltip component with dynamic content.

**Selector:** `app-dynamic-tooltip`

**Properties:**
- Various properties for dynamic tooltip behavior and content

## Illustrations

A set of illustration components for empty states and messaging.

**Components:**
- `IllustrationAiAssist` - AI assistant illustration
- `IllustrationConversation` - Conversation illustration
- `CustomerProfileIllustration` - Customer profile illustration
- `IllustrationNoData` - No data illustration
- `IllustrationServer` - Server illustration
- `IllustrationWarning` - Warning/error illustration