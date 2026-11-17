import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import type { ReservationStatus } from '../types';

const styles: Record<ReservationStatus, { cls: string; Icon: typeof Clock3 }> = {
  Confirmed: { cls: 'bg-forest-50 text-forest', Icon: Clock3 },
  Collected: { cls: 'bg-sage-light text-sage-dark', Icon: CheckCircle2 },
  Cancelled: { cls: 'bg-cream-dark text-charcoal-muted', Icon: XCircle },
};

export function StatusPill({ status }: { status: ReservationStatus }) {
  const { cls, Icon } = styles[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>
      <Icon className="h-3.5 w-3.5" /> {status === 'Confirmed' ? 'Confirmed · awaiting pickup' : status}
    </span>
  );
}
