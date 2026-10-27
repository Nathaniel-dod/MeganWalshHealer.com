import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { submitIntake } from '@/lib/submit-intake';
import {
  INTAKE_SECTIONS,
  initialValues,
  serializeIntake,
  validateIntake,
  type IntakeQuestion,
  type IntakeValues,
} from '@/data/intake';

const BASE = import.meta.env.BASE_URL;
const LOGO = `${BASE}logo.png`;

const field =
  'w-full rounded-md border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 disabled:opacity-60 aria-[invalid=true]:border-destructive';

function Mark({ className = '' }: { className?: string }) {
  return (
    <div className={`relative aspect-[1000/450] shrink-0 overflow-hidden ${className}`} aria-hidden="true">
      <img src={LOGO} alt="" width={1000} height={666} className="absolute left-0 top-0 h-auto w-full max-w-none" />
    </div>
  );
}

function Label({ q, n, htmlFor, as = 'label' }: { q: IntakeQuestion; n: number; htmlFor?: string; as?: 'label' | 'legend' }) {
  const inner = (
    <>
      <span className="mr-2 font-serif text-accent" aria-hidden="true">{n}.</span>
      {q.label}
      {q.required && (
        <span className="ml-1 text-destructive" aria-hidden="true">*</span>
      )}
      {q.required && <span className="sr-only"> (required)</span>}
    </>
  );
  const cls = 'block text-[0.95rem] font-semibold leading-snug text-primary';
  return as === 'legend' ? <legend className={cls}>{inner}</legend> : <label htmlFor={htmlFor} className={cls}>{inner}</label>;
}

function Question({
  q, n, value, error, onChange,
}: { q: IntakeQuestion; n: number; value: string | string[]; error?: string; onChange: (v: string | string[]) => void }) {
  const hintId = q.hint ? `${q.id}-hint` : undefined;
  const errId = error ? `${q.id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  const hint = q.hint && <p id={hintId} className="mt-1 text-sm text-muted-foreground">{q.hint}</p>;
  const err = error && <p id={errId} className="mt-2 text-sm font-semibold text-destructive" data-testid={`error-${q.id}`}>{error}</p>;

  if (q.kind === 'single' || q.kind === 'multi') {
    const multi = q.kind === 'multi';
    const arr = Array.isArray(value) ? value : [];
    return (
      <fieldset aria-describedby={describedBy} data-testid={`group-${q.id}`}>
        <Label q={q} n={n} as="legend" />
        {hint}
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options!.map((opt, i) => {
            const checked = multi ? arr.includes(opt) : value === opt;
            return (
              <label
                key={opt}
                className={`relative inline-flex cursor-pointer items-center gap-2 rounded-md border px-3.5 py-2 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/60'}`}
              >
                <input
                  type={multi ? 'checkbox' : 'radio'}
                  name={q.id}
                  value={opt}
                  checked={checked}
                  onChange={() => onChange(multi ? (checked ? arr.filter((x) => x !== opt) : [...arr, opt]) : opt)}
                  className="sr-only"
                  data-testid={`option-${q.id}-${i}`}
                />
                {multi && <Check className={`h-3.5 w-3.5 ${checked ? '' : 'opacity-25'}`} aria-hidden="true" />}
                {opt}
              </label>
            );
          })}
          {!multi && value && !q.required && (
            <button type="button" onClick={() => onChange('')} className="px-2 text-sm text-muted-foreground underline underline-offset-2 hover:text-primary" data-testid={`button-clear-${q.id}`}>
              Clear
            </button>
          )}
        </div>
      </fieldset>
    );
  }

  const v = typeof value === 'string' ? value : '';
  const common = {
    id: q.id,
    name: q.id,
    value: v,
    required: q.required,
    'aria-required': q.required || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    'data-testid': `input-${q.id}`,
  } as const;
  return (
    <div>
      <Label q={q} n={n} htmlFor={q.id} />
      {hint}
      <div className="mt-2.5">
        {q.kind === 'long' ? (
          <textarea {...common} rows={4} maxLength={6000} onChange={(e) => onChange(e.target.value)} className={`${field} min-h-28 resize-y leading-relaxed`} />
        ) : (
          <input
            {...common}
            type={q.kind === 'email' ? 'email' : q.kind === 'tel' ? 'tel' : 'text'}
            inputMode={q.kind === 'number' ? 'decimal' : undefined}
            pattern={q.kind === 'number' ? '[0-9]+(\\.[0-9]+)?' : undefined}
            autoComplete={q.id === 's1q1' ? 'name' : q.id === 's1q2' ? 'email' : q.id === 's1q3' ? 'tel' : 'off'}
            maxLength={q.kind === 'email' ? 254 : 500}
            onChange={(e) => onChange(e.target.value)}
            className={field}
          />
        )}
      </div>
      {err}
    </div>
  );
}

function SymptomRow({ q, n, value, onChange }: { q: IntakeQuestion; n: number; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="grid gap-2 border-b border-border/70 py-3.5 md:grid-cols-[1fr_auto] md:items-center md:gap-6" data-testid={`group-${q.id}`}>
      <legend className="float-left w-full text-sm font-semibold text-primary md:w-auto">
        <span className="mr-2 font-serif text-accent" aria-hidden="true">{n}.</span>{q.label}
      </legend>
      <div className="grid grid-cols-4 overflow-hidden rounded-md border border-border md:w-[26rem]">
        {q.options!.map((opt, i) => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              className={`cursor-pointer border-l border-border px-1 py-2 text-center text-xs font-medium transition first:border-l-0 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-ring sm:text-sm ${checked ? (i === 0 ? 'bg-secondary text-primary' : 'bg-primary text-primary-foreground') : 'bg-background text-muted-foreground hover:text-primary'}`}
            >
              <input type="radio" name={q.id} value={opt} checked={checked} onChange={() => onChange(opt)} className="sr-only" data-testid={`option-${q.id}-${i}`} />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function ConsultIntake() {
  const [values, setValues] = useState<IntakeValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [botcheck, setBotcheck] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [done, setDone] = useState(false);
  const submitting = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Perfect Day Consult Intake';
  }, []);

  const set = (id: string, v: string | string[]) => {
    setValues((prev) => ({ ...prev, [id]: v }));
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const errs = validateIntake(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    submitting.current = true;
    setIsPending(true);
    setIsError(false);
    try {
      await submitIntake({
        name: String(values.s1q1).trim(),
        email: String(values.s1q2).trim(),
        message: serializeIntake(values),
        botcheck,
      });
      setValues(initialValues());
      setBotcheck(false);
      setDone(true);
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setIsError(true);
      requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      submitting.current = false;
      setIsPending(false);
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="grain relative min-h-[100dvh] overflow-x-clip bg-background font-sans text-foreground">
      <header className="border-b border-border/60 px-5 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <Mark className="w-12" />
          <span className="font-serif text-base font-bold text-primary sm:text-lg">Spiritual in the Physical</span>
        </div>
      </header>

      <main className="px-5 pb-24 pt-12 sm:pt-16">
        <div className="mx-auto max-w-4xl">
          <p className="border-l-2 border-accent pl-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">Megan Walsh</p>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-primary sm:text-6xl">Perfect Day Consult Intake</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Take your time. There are eight sections, and only four questions are required. Share as much or as little as feels right; everything else can be left blank.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-md border-l-4 border-accent bg-secondary p-5 text-sm leading-relaxed text-secondary-foreground" data-testid="text-disclosure">
              <p className="font-semibold text-primary">Before you begin</p>
              <p className="mt-2">This form asks for sensitive personal and health information. Submitting sends your answers through Web3Forms to Megan by email. This link is unlisted, not access-restricted.</p>
              <p className="mt-2">Nothing is saved as you type and nothing is stored in your browser, so please complete it in one sitting. By pressing submit, you are choosing to send this information.</p>
              <a href={`${BASE}privacy-policy/`} className="mt-3 inline-block font-semibold text-primary underline underline-offset-2" data-testid="link-privacy">Privacy policy</a>
            </div>
            <div className="rounded-md border border-border bg-card p-5 text-sm leading-relaxed" data-testid="text-emergency">
              <p className="font-semibold text-primary">Not for emergencies</p>
              <p className="mt-2 text-muted-foreground">This form is not monitored in real time. If you are experiencing a medical emergency, contact your local emergency services.</p>
            </div>
          </div>

          {done ? (
            <div ref={statusRef} tabIndex={-1} role="status" className="mt-14 rounded-md border-2 border-primary bg-card p-8 outline-none sm:p-12" data-testid="text-success">
              <p className="font-serif text-3xl font-bold text-primary">Thank you.</p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">Your intake has been sent to Megan. She will read it before your consultation and be in touch. The form has been cleared from this page.</p>
              <button type="button" onClick={() => setDone(false)} className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground" data-testid="button-new-form">
                Start a new form <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-14" aria-busy={isPending} data-testid="form-intake">
              <input type="checkbox" name="botcheck" checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />

              <nav aria-label="Form sections" className="mb-10 flex flex-wrap gap-2">
                {INTAKE_SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}-title`} className="rounded border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-primary" data-testid={`link-section-${s.id}`}>
                    {s.number}. {s.title}
                  </a>
                ))}
              </nav>

              <fieldset disabled={isPending} className="space-y-16">
                {INTAKE_SECTIONS.map((s) => (
                  <section key={s.id} aria-labelledby={`${s.id}-title`} className="border-t-2 border-primary pt-8" data-testid={`section-${s.id}`}>
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif text-3xl font-bold text-accent" aria-hidden="true">{String(s.number).padStart(2, '0')}</span>
                      <h2 id={`${s.id}-title`} className="scroll-mt-6 font-serif text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                        <span className="sr-only">Section {s.number}: </span>{s.title}
                      </h2>
                    </div>
                    {s.instruction && (
                      <p className="mt-5 max-w-3xl rounded-md border-l-4 border-accent bg-secondary p-4 text-sm leading-relaxed text-secondary-foreground">{s.instruction}</p>
                    )}
                    {s.id === 's4' ? (
                      <div className="mt-6">
                        {s.questions.map((q, i) => (
                          <SymptomRow key={q.id} q={q} n={i + 1} value={String(values[q.id])} onChange={(v) => set(q.id, v)} />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-8 grid gap-x-8 gap-y-8 md:grid-cols-2">
                        {s.questions.map((q, i) => (
                          <div key={q.id} className={q.kind === 'long' || q.kind === 'single' || q.kind === 'multi' || q.label.length > 60 ? 'md:col-span-2' : ''}>
                            <Question q={q} n={i + 1} value={values[q.id]} error={errors[q.id]} onChange={(v) => set(q.id, v)} />
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}

                <div className="border-t-2 border-primary pt-8">
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Pressing submit sends every answer above, including sections left blank, to Megan by email through Web3Forms.
                  </p>
                  {errorCount > 0 && (
                    <p role="alert" className="mt-4 text-sm font-semibold text-destructive" data-testid="text-validation">
                      Please check {errorCount === 1 ? 'the highlighted answer' : `the ${errorCount} highlighted answers`} above.
                    </p>
                  )}
                  <button type="submit" disabled={isPending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 sm:w-auto" data-testid="button-submit">
                    {isPending ? 'Sending your intake...' : <>Submit intake <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </div>
              </fieldset>

              <div aria-live="polite" className="mt-6">
                {isError && (
                  <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-md bg-destructive/10 p-4 text-sm text-destructive outline-none" data-testid="text-error">
                    We could not confirm your intake was sent. All your answers are still here; please try again when you are ready.
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
