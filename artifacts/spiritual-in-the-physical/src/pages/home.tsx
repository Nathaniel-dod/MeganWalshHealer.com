import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowDown } from 'lucide-react';
import { useCreateEnquiry } from '@workspace/api-client-react';

const BASE = import.meta.env.BASE_URL;
const LOGO = `${BASE}logo.png`;

type Service =
  | 'CellSonic Regeneration'
  | 'Wolfe Non Surgical'
  | 'Perfect Day Consults'
  | 'General enquiry';

const SERVICES: { name: Exclude<Service, 'General enquiry'>; tint: string }[] = [
  { name: 'CellSonic Regeneration', tint: 'from-[hsl(330_85%_92%)] to-[hsl(300_70%_95%)]' },
  { name: 'Wolfe Non Surgical', tint: 'from-[hsl(270_70%_91%)] to-[hsl(240_80%_95%)]' },
  { name: 'Perfect Day Consults', tint: 'from-[hsl(205_85%_90%)] to-[hsl(270_60%_95%)]' },
];

const NAV = [
  ['Services', '#services'],
  ['About', '#about'],
  ['Contact', '#contact'],
] as const;

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Mark({ className = '' }: { className?: string }) {
  // Logo crop: show infinity loops only; wordmark is set in live type.
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <img src={LOGO} alt="" className="w-full" style={{ clipPath: 'inset(0 0 33% 0)', marginBottom: '-33%' }} />
    </div>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState<Service>('General enquiry');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const mutation = useCreateEnquiry();
  const reduce = useReducedMotion();

  const choose = (s: Service) => {
    setService(s);
    setReceipt(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setReceipt(null);
    mutation.mutate(
      { data: { name: name.trim(), email: email.trim(), service, message: message.trim(), consent: true } },
      {
        onSuccess: (r) => {
          setReceipt(r.message);
          setName('');
          setEmail('');
          setMessage('');
          setService('General enquiry');
          setConsent(false);
        },
      },
    );
  };

  const field =
    'w-full rounded-2xl border border-input/70 bg-white/70 px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30';

  return (
    <div className="grain relative min-h-[100dvh] overflow-x-clip bg-background font-sans text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2" data-testid="link-home">
            <Mark className="w-12" />
            <span className="font-serif text-lg leading-none text-primary">Spiritual in the Physical</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="text-sm text-muted-foreground transition hover:text-primary" data-testid={`link-nav-${l.toLowerCase()}`}>
                {l}
              </a>
            ))}
            <a href="#contact" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition hover:opacity-90" data-testid="button-nav-enquire">
              Say hello
            </a>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} data-testid="button-menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="flex flex-col gap-1 border-t border-border/60 px-5 pb-4 md:hidden">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="py-3 font-serif text-xl" data-testid={`link-mobile-${l.toLowerCase()}`}>
                {l}
              </a>
            ))}
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative flex min-h-[100dvh] items-center px-5 pb-16 pt-28">
          <div className="orb absolute -left-24 top-24 h-[28rem] w-[28rem] rounded-full bg-[hsl(330_90%_88%)] opacity-60 blur-3xl" />
          <div className="orb absolute -right-20 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[hsl(205_90%_86%)] opacity-60 blur-3xl" style={{ animationDelay: '-5s' }} />
          <div className="orb absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[hsl(270_80%_88%)] opacity-60 blur-3xl" style={{ animationDelay: '-9s' }} />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }} className="mb-6 text-sm uppercase tracking-[0.3em] text-primary">
                A personal invitation
              </motion.p>
              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl font-light leading-[1.02] sm:text-7xl"
              >
                Come as you are.
                <br />
                <em className="text-primary">Be met</em> where you are.
              </motion.h1>
              <motion.p initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9 }} className="mt-8 max-w-lg text-lg text-muted-foreground">
                A grounded, individual approach that treats your wellbeing as a whole: the spiritual and the physical, held together.
              </motion.p>
              <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-10 flex flex-wrap gap-4">
                <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-primary-foreground transition hover:opacity-90" data-testid="button-hero-contact">
                  Start a conversation <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
                <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-7 py-3.5 text-primary transition hover:bg-secondary" data-testid="button-hero-services">
                  Explore services <ArrowDown className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
            <motion.div initial={reduce ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.3 }} className="relative">
              <div className="rounded-[3rem] border border-white/70 bg-white/50 p-8 shadow-[0_30px_80px_-30px_hsl(270_50%_60%/0.35)] backdrop-blur">
                <img src={LOGO} alt="Spiritual in the Physical infinity logo" className="w-full" data-testid="img-logo" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Services</p>
              <h2 className="mt-3 max-w-xl font-serif text-4xl font-light sm:text-5xl">Ways we can work together</h2>
            </Reveal>
            <div className="mt-14 divide-y divide-border">
              {SERVICES.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.08}>
                  <div className={`group grid gap-4 rounded-3xl bg-gradient-to-r ${s.tint} p-7 my-4 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10`} data-testid={`card-service-${i}`}>
                    <span className="font-serif text-4xl text-primary/50">0{i + 1}</span>
                    <div>
                      <h3 className="font-serif text-2xl">{s.name}</h3>
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        Placeholder: description of this service will be supplied by the practitioner.
                      </p>
                    </div>
                    <button onClick={() => choose(s.name)} className="inline-flex items-center gap-2 rounded-full bg-background/80 px-5 py-2.5 text-sm text-primary transition hover:bg-primary hover:text-primary-foreground" data-testid={`button-enquire-${i}`}>
                      Enquire about this <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </Reveal>
              ))}
              <Reveal>
                <p className="py-6 text-sm text-muted-foreground" data-testid="text-more-services">
                  More services to be added.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-gradient-to-b from-muted to-background px-5 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal>
              <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-br from-[hsl(330_85%_90%)] via-[hsl(270_70%_90%)] to-[hsl(205_85%_88%)]">
                <Mark className="w-3/4" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">About</p>
              <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">Meet your practitioner</h2>
              <div className="mt-6 rounded-3xl border border-dashed border-primary/40 bg-white/50 p-6" data-testid="text-about-placeholder">
                <p className="text-sm font-medium uppercase tracking-widest text-primary">Placeholder</p>
                <p className="mt-2 text-muted-foreground">
                  The practitioner's name, story, training and approach will be added here once supplied. Nothing on this page should be read as a credential or claim.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative px-5 py-24">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Contact</p>
              <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
                Tell me a little about <em className="text-primary">you</em>
              </h2>
              <p className="mt-6 text-muted-foreground">Send a note and choose the service you are curious about. There is no obligation.</p>
              <p className="mt-6 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground" data-testid="text-storage-note">
                Please note: enquiries are stored only. Email notifications are not yet connected, so a reply may not be immediate. Do not include sensitive health information.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <form onSubmit={submit} className="space-y-5 rounded-[2rem] border border-white/80 bg-white/60 p-6 shadow-[0_30px_80px_-40px_hsl(270_50%_55%/0.4)] backdrop-blur sm:p-8" data-testid="form-enquiry">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm">Name</label>
                  <input id="name" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className={field} data-testid="input-name" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm">Email</label>
                  <input id="email" type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className={field} data-testid="input-email" />
                </div>
                <div>
                  <label htmlFor="service" className="mb-1.5 block text-sm">Service</label>
                  <select id="service" value={service} onChange={(e) => setService(e.target.value as Service)} className={field} data-testid="select-service">
                    {[...SERVICES.map((s) => s.name), 'General enquiry'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm">Message</label>
                  <textarea id="message" required rows={5} maxLength={3000} value={message} onChange={(e) => setMessage(e.target.value)} className={field} data-testid="input-message" />
                </div>
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[hsl(236_52%_46%)]" data-testid="checkbox-consent" />
                  I agree to my details being stored so I can be contacted about this enquiry.
                </label>
                <button type="submit" disabled={mutation.isPending || !consent} className="w-full rounded-full bg-primary px-7 py-3.5 text-primary-foreground transition hover:opacity-90 disabled:opacity-50" data-testid="button-submit">
                  {mutation.isPending ? 'Saving your enquiry...' : 'Send enquiry'}
                </button>
                <div aria-live="polite">
                  {receipt && (
                    <p className="rounded-2xl bg-secondary p-4 text-sm" data-testid="text-receipt">{receipt}</p>
                  )}
                  {mutation.isError && (
                    <p className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive" role="alert" data-testid="text-error">
                      Your enquiry could not be saved. Please check the details and try again.
                    </p>
                  )}
                </div>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/60 px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Mark className="w-14" />
            <span className="font-serif text-xl text-primary">Spiritual in the Physical</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="hover:text-primary" data-testid={`link-footer-${l.toLowerCase()}`}>{l}</a>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">Content marked placeholder is awaiting supplied details.</p>
        </div>
      </footer>
    </div>
  );
}
