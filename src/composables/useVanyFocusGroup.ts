import {
  ref,
  computed,
  onUnmounted,
} from 'vue';

import { type Ref as MinRef } from '@xirelogy/vue-minimal';
import { xw, type XwCoolOffHandleable } from '@xirelogy/xwts';

/**
 * Vue component with focus/blur event support
 */
export interface VanyFocusGroupVueComponent {
  $el?: HTMLElement;
  $on: (event: string, handler: (...args: any[]) => void) => void;
  $off: (event: string, handler: (...args: any[]) => void) => void;
}

/**
 * Focus forwarder object with focus/blur handler methods
 */
export interface VanyFocusGroupFocusForwarder {
  onFocus: (handler: () => void) => void;
  onBlur: (handler: () => void) => void;
}

/**
 * Control that can be registered to a focus group.
 * Strict union of 3 types:
 * - HTMLElement
 * - VanyFocusGroupVueComponent
 * - VanyFocusGroupFocusForwarder
 */
export type VanyFocusGroupControl =
  | HTMLElement
  | VanyFocusGroupVueComponent
  | VanyFocusGroupFocusForwarder;

/**
 * Options for focus group configuration
 */
export interface VanyFocusGroupOptions {
  /**
   * Cool-off time in milliseconds before confirming blur event
   * @default 100
   */
  coolOffMs?: number;
}

/**
 * Service returned by useVanyFocusGroup
 */
export interface VanyFocusGroupService {
  /**
   * Whether any control in the group currently has focus
   */
  readonly isFocused: MinRef<boolean>;

  /**
   * Register a control to the focus group
   * @param control The HTML element or Vue component to register
   * @returns Cleanup function to unregister the control
   */
  registerControl(control: VanyFocusGroupControl): () => void;

  /**
   * Unregister a control from the focus group
   * @param control The HTML element or Vue component to unregister
   */
  unregisterControl(control: VanyFocusGroupControl): void;
}

/**
 * Manages focus/blur events for a group of controls. The group raises focus
 * when any control gains focus, and raises blur only when focus truly leaves
 * all controls in the group.
 *
 * Supports both native HTMLElements and Vue components.
 *
 * @param options Configuration options
 * @returns Focus group service
 */
export function useVanyFocusGroup(options?: VanyFocusGroupOptions): VanyFocusGroupService {
  const coolOffMs = options?.coolOffMs ?? 100;

  // Track registered controls (both elements and component instances)
  const controls = new Set<VanyFocusGroupControl>();

  // Track associated HTMLElements for active element checking
  const elements = new Set<HTMLElement>();

  // Track focus state
  const isFocused = ref(false);

  // Cool-off handler for blur events
  const blurCoolOff: XwCoolOffHandleable = xw.createCoolOff();

  // Event listener storage for cleanup
  const eventListeners = new WeakMap<VanyFocusGroupControl, {
    focus: EventListener;
    blur: EventListener;
  }>();

  /**
   * Check if the currently active element is within the focus group
   */
  function isActiveElementInGroup(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    // Check if active element is one of our registered elements
    // or is contained within one of them
    for (const el of Array.from(elements)) {
      if (el === activeElement || el.contains(activeElement)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Handle focus event on a control
   */
  function handleFocusIn(): void {
    // Cancel any pending blur check
    blurCoolOff.dismiss();

    // Immediately set focused state
    if (!isFocused.value) {
      isFocused.value = true;
    }
  }

  /**
   * Handle blur event on a control
   */
  function handleFocusOut(): void {
    // Use cool-off to delay the blur check
    // This handles the case where focus moves from one control to another
    blurCoolOff.delay(coolOffMs, () => {
      // After cool-off period, check if focus is still within the group
      if (!isActiveElementInGroup()) {
        isFocused.value = false;
      }
    });
  }

  /**
   * Determine if a control is an HTMLElement
   */
  function isHTMLElement(control: VanyFocusGroupControl): control is HTMLElement {
    return control instanceof HTMLElement;
  }

  /**
   * Determine if a control is a VanyFocusGroupVueComponent
   */
  function isVueComponent(control: VanyFocusGroupControl): control is VanyFocusGroupVueComponent {
    return !isHTMLElement(control) && '$on' in control && '$off' in control;
  }

  /**
   * Determine if a control is a VanyFocusGroupFocusForwarder
   */
  function isFocusForwarder(control: VanyFocusGroupControl): control is VanyFocusGroupFocusForwarder {
    return !isHTMLElement(control) && 'onFocus' in control && 'onBlur' in control;
  }

  /**
   * Get the HTMLElement from a control (for active element checking)
   */
  function getElement(control: VanyFocusGroupControl): HTMLElement | undefined {
    if (isHTMLElement(control)) {
      return control;
    }
    if (isVueComponent(control)) {
      return control.$el;
    }
    return undefined;
  }

  /**
   * Register a control to the focus group
   */
  function registerControl(control: VanyFocusGroupControl): () => void {
    if (controls.has(control)) {
      // Already registered
      return () => unregisterControl(control);
    }

    // Create event listeners
    const listeners = {
      focus: handleFocusIn,
      blur: handleFocusOut,
    };

    // Register control
    controls.add(control);
    eventListeners.set(control, listeners);

    // Track the HTMLElement for active element checking
    const el = getElement(control);
    if (el) {
      elements.add(el);
    }

    // Attach event listeners based on control type
    if (isHTMLElement(control)) {
      // Native DOM element: use focusin/focusout (they bubble)
      control.addEventListener('focusin', listeners.focus);
      control.addEventListener('focusout', listeners.blur);
    } else if (isFocusForwarder(control)) {
      // Focus forwarder: use onFocus/onBlur methods
      control.onFocus(listeners.focus);
      control.onBlur(listeners.blur);
    } else if (isVueComponent(control)) {
      // Vue component: use focus/blur events
      control.$on('focus', listeners.focus);
      control.$on('blur', listeners.blur);
    } else if (el) {
      // Fallback: use native events on $el if available
      el.addEventListener('focusin', listeners.focus);
      el.addEventListener('focusout', listeners.blur);
    }

    // Return cleanup function
    return () => unregisterControl(control);
  }

  /**
   * Unregister a control from the focus group
   */
  function unregisterControl(control: VanyFocusGroupControl): void {
    if (!controls.has(control)) {
      return; // Not registered
    }

    // Get and remove event listeners
    const listeners = eventListeners.get(control);
    if (listeners) {
      if (isHTMLElement(control)) {
        // Native DOM element
        control.removeEventListener('focusin', listeners.focus);
        control.removeEventListener('focusout', listeners.blur);
      } else if (isFocusForwarder(control)) {
        // Focus forwarder: no cleanup needed, handlers are just callbacks
      } else if (isVueComponent(control)) {
        // Vue component
        control.$off('focus', listeners.focus);
        control.$off('blur', listeners.blur);
      } else {
        const el = getElement(control);
        if (el) {
          el.removeEventListener('focusin', listeners.focus);
          el.removeEventListener('focusout', listeners.blur);
        }
      }
      eventListeners.delete(control);
    }

    // Unregister control and its element
    controls.delete(control);
    const el = getElement(control);
    if (el) {
      elements.delete(el);
    }

    // If this was the last control and we're focused, trigger blur check
    if (controls.size === 0 && isFocused.value) {
      blurCoolOff.delay(coolOffMs, () => {
        if (!isActiveElementInGroup()) {
          isFocused.value = false;
        }
      });
    }
  }

  /**
   * Cleanup on unmount
   */
  onUnmounted(() => {
    // Dismiss any pending blur checks
    blurCoolOff.dismiss();

    // Unregister all controls
    const controlsArray = Array.from(controls);
    for (const control of controlsArray) {
      unregisterControl(control);
    }
  });

  return {
    isFocused: computed(() => isFocused.value),
    registerControl,
    unregisterControl,
  };
}
