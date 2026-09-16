const IOS_SAFARI_CLASS = 'ios-safari';
const IOS_KEYBOARD_OPEN_CLASS = 'ios-keyboard-open';

function isIPhoneSafari() {
  const userAgent = navigator.userAgent;
  const isIPhone = /iPhone|iPod/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);
  return isIPhone && isSafari;
}

function isEditableElement(target: EventTarget | null): target is HTMLElement {
  if (!(target instanceof HTMLElement)) return false;
  return target.matches('input, textarea, select, [contenteditable="true"]');
}

export function installIPhoneSafariOptimizations() {
  if (!isIPhoneSafari()) {
    return () => undefined;
  }

  const root = document.documentElement;
  const viewport = window.visualViewport;
  let focusTimer: number | undefined;

  root.classList.add(IOS_SAFARI_CLASS);

  const syncViewport = () => {
    const visualHeight = viewport?.height ?? window.innerHeight;
    const layoutHeight = window.innerHeight;
    const keyboardDelta = viewport ? Math.max(0, layoutHeight - viewport.height - viewport.offsetTop) : 0;
    const keyboardOpen = keyboardDelta > 120;

    root.style.setProperty('--ios-viewport-height', `${Math.round(visualHeight)}px`);
    root.style.setProperty('--ios-keyboard-height', `${Math.round(keyboardDelta)}px`);
    root.classList.toggle(IOS_KEYBOARD_OPEN_CLASS, keyboardOpen);
  };

  const handleFocusIn = (event: FocusEvent) => {
    if (!isEditableElement(event.target)) return;

    window.clearTimeout(focusTimer);
    focusTimer = window.setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      }
      syncViewport();
    }, 260);
  };

  const handleFocusOut = () => {
    window.clearTimeout(focusTimer);
    focusTimer = window.setTimeout(syncViewport, 180);
  };

  syncViewport();

  viewport?.addEventListener('resize', syncViewport);
  viewport?.addEventListener('scroll', syncViewport);
  window.addEventListener('resize', syncViewport);
  window.addEventListener('orientationchange', syncViewport);
  document.addEventListener('focusin', handleFocusIn);
  document.addEventListener('focusout', handleFocusOut);

  return () => {
    window.clearTimeout(focusTimer);
    viewport?.removeEventListener('resize', syncViewport);
    viewport?.removeEventListener('scroll', syncViewport);
    window.removeEventListener('resize', syncViewport);
    window.removeEventListener('orientationchange', syncViewport);
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('focusout', handleFocusOut);
    root.classList.remove(IOS_SAFARI_CLASS, IOS_KEYBOARD_OPEN_CLASS);
    root.style.removeProperty('--ios-viewport-height');
    root.style.removeProperty('--ios-keyboard-height');
  };
}
