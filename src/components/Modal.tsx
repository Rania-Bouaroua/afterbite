import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Stack of open modals, so Escape and focus trapping only apply to the top one.
const stack: string[] = [];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (still announced to screen readers). */
  hideTitle?: boolean;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** On phones, slide up as a bottom sheet. */
  sheet?: boolean;
  padded?: boolean;
}

const sizes = { sm: 'sm:max-w-md', md: 'sm:max-w-xl', lg: 'sm:max-w-3xl', xl: 'sm:max-w-5xl' };

export function Modal({ open, onClose, title, hideTitle, children, size = 'md', sheet = true, padded = true }: ModalProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    stack.push(id);
    document.body.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const t = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0];
      (first ?? panelRef.current)?.focus();
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === 'Tab') {
        const els = focusables();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      const i = stack.indexOf(id);
      if (i >= 0) stack.splice(i, 1);
      if (stack.length === 0) document.body.style.overflow = '';
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, id]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-forest-900/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-cream shadow-float outline-none animate-scale-in ${
          sheet ? 'rounded-t-4xl sm:rounded-4xl' : 'mx-4 rounded-4xl'
        } ${sizes[size]}`}
      >
        {sheet && <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-charcoal/15 sm:hidden" aria-hidden="true" />}
        <div className={`flex items-center justify-between gap-4 ${hideTitle ? 'absolute right-0 top-0 z-10 p-3 sm:p-4' : 'px-5 pb-2 pt-4 sm:px-7 sm:pt-6'}`}>
          <h2 id={`${id}-title`} className={hideTitle ? 'sr-only' : 'font-display text-2xl font-semibold text-forest'}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/90 text-charcoal shadow-card transition hover:bg-white hover:text-forest focus-visible:ring-2 focus-visible:ring-forest"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={`overflow-y-auto overscroll-contain ${padded ? 'px-5 pb-6 sm:px-7 sm:pb-7' : ''}`}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
