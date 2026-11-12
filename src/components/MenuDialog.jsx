import React, { useEffect, useRef } from 'react';
import './MenuDialog.css';

export function useMenuFocus() {
  const dialogRef = useRef(null);
  useEffect(() => {
    dialogRef.current?.querySelector('[data-menu-autofocus]')?.focus();
  }, []);

  function keepFocus(event) {
    if (event.key !== 'Tab') return;
    const buttons = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled)')];
    if (!buttons.length) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  }
  return { dialogRef, keepFocus };
}

export const MenuDialog = ({ title, children, actions }) => {
  const { dialogRef, keepFocus } = useMenuFocus();
  return (
    <section ref={dialogRef} className="screen menu-dialog" role="dialog" aria-modal="true" aria-labelledby="menu-dialog-title" onKeyDown={keepFocus}>
      <h2 id="menu-dialog-title">{title}</h2>
      {children}
      <div className="menu-actions">{actions}</div>
    </section>
  );
};
