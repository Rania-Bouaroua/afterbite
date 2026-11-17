import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Page } from '../types';
import { goBack } from '../router';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  backTo?: Page;
  backLabel?: string;
  actions?: ReactNode;
}

/** App-style screen header with a back button. */
export function PageHeader({ title, subtitle, backTo = 'home', backLabel = 'Back', actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <button
          onClick={() => goBack(backTo)}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-sm font-bold text-forest shadow-sm transition hover:bg-forest-50"
        >
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </button>
        {title && <h1 className="section-title">{title}</h1>}
        {subtitle && <p className="mt-2 text-charcoal-soft">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
