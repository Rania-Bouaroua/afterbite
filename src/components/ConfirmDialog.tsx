import { TriangleAlert } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel = 'Keep it', tone = 'danger', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} hideTitle size="sm" sheet={false}>
      <div className="pt-8 text-center">
        <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${tone === 'danger' ? 'bg-tangerine-light text-tangerine-dark' : 'bg-forest-50 text-forest'}`}>
          <TriangleAlert className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-charcoal">{title}</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-charcoal-soft">{message}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} data-autofocus className="btn-secondary">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={tone === 'danger' ? 'btn-base bg-charcoal text-white hover:bg-black' : 'btn-primary'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
