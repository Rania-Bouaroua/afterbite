import { useState, type FormEvent } from 'react';
import { CheckCircle2, HandCoins, Loader2, Megaphone, Recycle, Send, Sprout, TriangleAlert } from 'lucide-react';
import { CATEGORIES, CITIES, type PartnerApplication } from '../types';
import { heroImages } from '../data/images';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './Toast';
import { SafeImage } from './SafeImage';

type FormValues = Omit<PartnerApplication, 'id' | 'submittedAt'>;
type Errors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { restaurantName: '', ownerName: '', email: '', phone: '', category: '', city: '', message: '' };
const EMPTY_APPS: PartnerApplication[] = [];

const benefits = [
  { icon: HandCoins, title: 'Recover revenue', text: 'Turn end-of-day surplus into income instead of losses.' },
  { icon: Recycle, title: 'Reduce food waste', text: 'Cut what goes in the bin and simplify your closing routine.' },
  { icon: Megaphone, title: 'Attract new customers', text: 'Get discovered by thousands of nearby food lovers every evening.' },
  { icon: Sprout, title: 'Promote sustainability', text: 'Show your community you care — and earn a green partner badge.' },
];

function validate(v: FormValues): Errors {
  const e: Errors = {};
  if (v.restaurantName.trim().length < 2) e.restaurantName = 'Please enter your restaurant’s name.';
  if (!/^[\p{L}][\p{L} '.-]{1,}$/u.test(v.ownerName.trim())) e.ownerName = 'Please enter the owner’s full name (letters only).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address, e.g. name@restaurant.ma';
  const phone = v.phone.replace(/[\s.-]/g, '');
  if (!/^(\+212|00212|0)[5-7]\d{8}$/.test(phone)) e.phone = 'Enter a Moroccan number, e.g. 06 12 34 56 78 or +212 6 12 34 56 78.';
  if (!v.category) e.category = 'Please choose a category.';
  if (!v.city) e.city = 'Please choose your city.';
  if (v.message.trim().length < 20) e.message = `Tell us a bit more (at least 20 characters — ${v.message.trim().length}/20).`;
  else if (v.message.length > 500) e.message = 'Please keep your message under 500 characters.';
  return e;
}

export function PartnerForm() {
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<PartnerApplication | null>(null);
  const [applications, setApplications] = useLocalStorage<PartnerApplication[]>('partner-applications', EMPTY_APPS);

  const errors = validate(values);
  const show = (k: keyof FormValues) => (touched[k] ? errors[k] : undefined);

  const update = <K extends keyof FormValues>(k: K, val: FormValues[K]) => setValues((v) => ({ ...v, [k]: val }));
  const blur = (k: keyof FormValues) => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    const errs = validate(values);
    if (Object.keys(errs).length) {
      toast({ kind: 'error', title: 'Please check the form', message: `${Object.keys(errs).length} field(s) need your attention.` });
      const first = Object.keys(errs)[0];
      document.getElementById(`partner-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      const app: PartnerApplication = {
        ...values,
        restaurantName: values.restaurantName.trim(),
        ownerName: values.ownerName.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        id: `PA-${Date.now().toString(36).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
      };
      setApplications((prev) => [app, ...prev]);
      setSubmitting(false);
      setSubmitted(app);
      setValues(EMPTY);
      setTouched({});
      toast({ kind: 'success', title: 'Application received!', message: `Thanks ${app.ownerName.split(' ')[0]} — we’ll be in touch within 48h (demo).` });
    }, 900);
  };

  const fieldCls = (k: keyof FormValues) => `field ${show(k) ? 'field-error' : ''}`;
  const Err = ({ k }: { k: keyof FormValues }) =>
    show(k) ? (
      <p id={`partner-${k}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-tangerine-dark">
        <TriangleAlert className="h-3.5 w-3.5 shrink-0" /> {show(k)}
      </p>
    ) : null;
  const aria = (k: keyof FormValues) => ({
    id: `partner-${k}`,
    'aria-invalid': !!show(k),
    'aria-describedby': show(k) ? `partner-${k}-error` : undefined,
    onBlur: () => blur(k),
  });

  return (
    <section id="partner" className="scroll-mt-20 py-16 sm:py-24" aria-labelledby="partner-title">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        {/* Pitch */}
        <div>
          <p className="eyebrow">For restaurants</p>
          <h2 id="partner-title" className="section-title mt-3">Turn your surplus food into opportunity.</h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-charcoal-soft">
            Join AfterBite and sell your unsold fresh food every evening from 8 PM. No setup fees during the pilot — you only list what you have left.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b.title} className="rounded-3xl border border-forest/10 bg-white p-5 transition hover:shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-50 text-forest">
                  <b.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-bold text-charcoal">{b.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">{b.text}</p>
              </li>
            ))}
          </ul>
          <div className="relative mt-6 hidden overflow-hidden rounded-4xl lg:block">
            <SafeImage photoId={heroImages.interior} alt="A warm, busy restaurant interior" width={900} height={420} className="h-56" />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-900/80 to-transparent" />
            <p className="absolute bottom-6 left-6 max-w-xs font-display text-2xl font-semibold leading-snug text-white">
              “List tonight’s surplus in under a minute.”
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-4xl bg-white p-5 shadow-lift sm:p-8">
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <span className="grid h-20 w-20 animate-scale-in place-items-center rounded-full bg-sage-light text-forest">
                <CheckCircle2 className="h-10 w-10" />
              </span>
              <h3 className="mt-5 font-display text-3xl font-semibold text-forest">Welcome aboard, {submitted.restaurantName}!</h3>
              <p className="mx-auto mt-3 max-w-sm text-charcoal-soft">
                Your partnership request <span className="font-mono font-bold text-charcoal">{submitted.id}</span> has been saved. Our team would contact{' '}
                <strong>{submitted.email}</strong> within 48 hours.
              </p>
              <p className="mt-2 text-xs text-charcoal-muted">Demo only — stored locally in this browser ({applications.length} application{applications.length === 1 ? '' : 's'} on this device).</p>
              <button onClick={() => setSubmitted(null)} className="btn-secondary mt-7">Submit another restaurant</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <h3 className="font-display text-2xl font-semibold text-forest">Partner application</h3>
              <p className="mt-1 text-sm text-charcoal-muted">All fields are required. Takes about 2 minutes.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="partner-restaurantName">Restaurant name</label>
                  <input {...aria('restaurantName')} className={fieldCls('restaurantName')} value={values.restaurantName} onChange={(e) => update('restaurantName', e.target.value)} placeholder="e.g. Café Andalous" autoComplete="organization" />
                  <Err k="restaurantName" />
                </div>
                <div>
                  <label className="field-label" htmlFor="partner-ownerName">Owner name</label>
                  <input {...aria('ownerName')} className={fieldCls('ownerName')} value={values.ownerName} onChange={(e) => update('ownerName', e.target.value)} placeholder="e.g. Salma Bennani" autoComplete="name" />
                  <Err k="ownerName" />
                </div>
                <div>
                  <label className="field-label" htmlFor="partner-email">Email</label>
                  <input {...aria('email')} type="email" className={fieldCls('email')} value={values.email} onChange={(e) => update('email', e.target.value)} placeholder="name@restaurant.ma" autoComplete="email" />
                  <Err k="email" />
                </div>
                <div>
                  <label className="field-label" htmlFor="partner-phone">Phone number</label>
                  <input {...aria('phone')} type="tel" className={fieldCls('phone')} value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="06 12 34 56 78" autoComplete="tel" />
                  <Err k="phone" />
                </div>
                <div>
                  <label className="field-label" htmlFor="partner-category">Restaurant category</label>
                  <select {...aria('category')} className={fieldCls('category')} value={values.category} onChange={(e) => update('category', e.target.value as FormValues['category'])}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Err k="category" />
                </div>
                <div>
                  <label className="field-label" htmlFor="partner-city">City</label>
                  <select {...aria('city')} className={fieldCls('city')} value={values.city} onChange={(e) => update('city', e.target.value as FormValues['city'])}>
                    <option value="">Select a city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Err k="city" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label flex justify-between" htmlFor="partner-message">
                    Message <span className="text-xs font-normal text-charcoal-muted">{values.message.length}/500</span>
                  </label>
                  <textarea {...aria('message')} rows={4} maxLength={500} className={`${fieldCls('message')} resize-none`} value={values.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell us about your restaurant and how much surplus you usually have in the evening…" />
                  <Err k="message" />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full py-4 text-[15px]">
                {submitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending application…</> : <><Send className="h-4 w-4" /> Apply to become a partner</>}
              </button>
              <p className="mt-3 text-center text-xs text-charcoal-muted">Demo form — your details stay in this browser and are never sent anywhere.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
