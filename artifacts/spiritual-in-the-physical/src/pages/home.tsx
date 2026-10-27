import { useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowDown, ChevronDown } from 'lucide-react';
import { submitEnquiry } from '@/lib/submit-enquiry';

import ShopSection from '@/components/shop-section';

const BASE = import.meta.env.BASE_URL;
const LOGO = `${BASE}logo.png`;

type Service =
  | 'CellSonic Regeneration'
  | 'Wolfe Non Surgical'
  | 'Perfect Day Consults'
  | 'Reiki Healing'
  | 'Palm Readings'
  | 'Intuitive Tarot Readings'
  | 'Mediumship Readings'
  | 'Ordained Ministry'
  | 'General enquiry';

const ONLINE_SERVICES: readonly Service[] = [
  'Perfect Day Consults',
  'Mediumship Readings',
  'Intuitive Tarot Readings',
];
const serviceFormat = (service: Service) =>
  ONLINE_SERVICES.includes(service) ? 'Online' : 'In person';

const SERVICES: { name: Exclude<Service, 'General enquiry'>; blurb: string }[] = [
  { name: 'Wolfe Non Surgical', blurb: 'Wolfe Non Surgical is a focused, hands-on bodywork approach centred on areas of physical restriction. It focuses on scar tissue, inflammation, calcification and crystallization that may contribute to discomfort and limited movement. The aim is to support greater comfort, mobility and freedom of movement without surgery. Get in touch to discuss the areas you would like support with and what a session may involve.' },
  { name: 'CellSonic Regeneration', blurb: 'CellSonic Regeneration uses Extracorporeal Shock Wave Therapy (ESWT): focused acoustic waves applied from outside the body. This non-invasive approach is designed to complement the body’s natural tissue-recovery processes and support comfort, mobility and recovery. It may also support circulation and a healthy inflammatory response. Get in touch to discuss your goals and whether this approach may be appropriate for you.' },
  { name: 'Perfect Day Consults', blurb: 'A Perfect Day consultation brings nutritional, emotional and physical wellbeing into one personalised conversation. Together, we explore your goals and the areas of everyday life where you would like more support, with the aim of creating a clear, step-by-step strategy. It is an opportunity to ask questions, gain perspective and identify practical next steps for your wellbeing. Contact me to discuss consultation options.' },
  { name: 'Reiki Healing', blurb: 'Release the rush of everyday life and make room for stillness. Reiki is a gentle, holistic energy practice intended to encourage relaxation, inner peace and emotional balance. My goal is to support your natural sense of wellbeing, help ease everyday stress and create space for renewal. Each session is offered with love, respect and care for your individual journey.' },
  { name: 'Palm Readings', blurb: 'Your hands tell a story through the traditions of palmistry. Discover the symbolism of your palm lines in a personalised experience focused on self-awareness and on the physical and spiritual strengths that reflect your soul’s journey.' },
  { name: 'Intuitive Tarot Readings', blurb: 'Through intuitive impressions and compassionate conversation, we look at the energies present in your life right now. I can answer your questions and offer advice if you would like it.' },
  { name: 'Mediumship Readings', blurb: 'We explore spiritual connections with passed-on loved ones, guides and guardians. Each session is approached with sensitivity, respect and care, honouring the emotions and personal meaning that accompany remembrance.' },
  { name: 'Ordained Ministry', blurb: 'As an ordained minister, I am devoted to serving others through love, compassion, spiritual guidance and healing. My mission is to create a safe, peaceful and uplifting space.' },
];

const NAV = [
  ['Services', '#services'],
  ['About', '#about'],
  ['Contact', '#contact'],
  ['Shop', '#shop'],
] as const;

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={false}
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
    <div className={`relative aspect-[1000/450] shrink-0 overflow-hidden ${className}`} aria-hidden="true">
      <img src={LOGO} alt="" width={1000} height={666} className="absolute left-0 top-0 h-auto w-full max-w-none" />
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
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [botcheck, setBotcheck] = useState(false);
  const submitting = useRef(false);
  const reduce = useReducedMotion();

  const choose = (s: Service) => {
    setService(s);
    setReceipt(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent || submitting.current) return;
    submitting.current = true;
    setIsPending(true);
    setIsError(false);
    setReceipt(null);
    try {
      await submitEnquiry({ name, email, service, message, consent, botcheck });
      setReceipt('Thank you! Your enquiry has been sent to Megan. She will be in touch.');
      setName('');
      setEmail('');
      setMessage('');
      setService('General enquiry');
      setConsent(false);
    } catch {
      setIsError(true);
    } finally {
      submitting.current = false;
      setIsPending(false);
    }
  };

  const field =
    'w-full rounded-md border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30';

  return (
    <div className="grain relative min-h-[100dvh] overflow-x-clip bg-background font-sans text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="mr-3 flex min-w-0 items-center gap-2" data-testid="link-home">
            <Mark className="w-12" />
            <span className="min-w-0 font-serif text-base font-bold leading-tight text-primary sm:text-lg">Spiritual in the Physical</span>
          </a>
          <nav className="hidden shrink-0 items-center gap-6 md:flex lg:gap-8">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="text-sm text-muted-foreground transition hover:text-primary" data-testid={`link-nav-${l.toLowerCase()}`}>
                {l}
              </a>
            ))}
            <a href="#contact" className="rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground transition hover:opacity-90" data-testid="button-nav-enquire">
              Say hello
            </a>
          </nav>
          <button className="flex h-10 w-10 shrink-0 items-center justify-center md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} data-testid="button-menu">
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
        <section className="relative flex min-h-[100dvh] items-center overflow-hidden px-5 pb-16 pt-28">
          <img src={`${BASE}hero-celestial.png`} alt="" width={1024} height={576} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[72%_center]" data-testid="img-hero-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(40_33%_95%/0.96)] via-[hsl(40_33%_95%/0.8)] to-transparent md:via-[hsl(40_33%_95%/0.55)] md:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="relative mx-auto w-full max-w-6xl">
            <div className="max-w-xl">
              <motion.p initial={false} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="mb-6 border-l-2 border-accent pl-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">
                Megan Walsh
              </motion.p>
              <motion.h1
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl font-bold leading-[1.02] tracking-tight text-primary sm:text-7xl"
              >
                A sacred space for healing, insight and connection.
              </motion.h1>
              <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-7 max-w-lg text-lg font-medium leading-relaxed text-foreground">
                Step into a welcoming space where spirituality meets compassion and personal discovery. Whether you are seeking clarity, energetic balance or support during a season of change, you are welcome here exactly as you are.
              </motion.p>
              <motion.div initial={false} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-9 flex flex-wrap gap-4">
                <a href="#contact" className="group inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:bg-[hsl(232_45%_30%)]" data-testid="button-hero-contact">
                  Start a conversation <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
                <a href="#services" className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-7 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground" data-testid="button-hero-services">
                  Explore services <ArrowDown className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">Services</p>
              <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">Ways we can work together</h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">Perfect Day Consults, Mediumship Readings and Intuitive Tarot Readings are offered online. All other services are offered in person in Michigan and surrounding areas.</p>
              <p className="mt-3 text-sm text-muted-foreground">Choose a service below to explore the details.</p>
            </Reveal>
            <div className="mt-12 border-t-2 border-primary">
              {SERVICES.map((s, i) => (
                <Reveal key={s.name} delay={0.04}>
                  <details className="group border-b border-border" data-testid={`card-service-${i}`}>
                    <summary className="flex cursor-pointer list-none items-center gap-5 py-7 outline-none transition hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden md:gap-10">
                      <span className="w-10 shrink-0 font-serif text-3xl font-bold text-accent" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-primary sm:text-2xl">{s.name}</h3>
                        <span className="mt-2 inline-block rounded border border-border bg-secondary px-2.5 py-1 font-sans text-xs font-semibold text-primary">{serviceFormat(s.name)}</span>
                      </div>
                      <ChevronDown className="mr-2 h-6 w-6 shrink-0 text-primary transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                    </summary>
                    <div className="pb-8 pl-[3.75rem] md:pl-20">
                      <p className="mb-3 text-sm font-semibold text-primary">{serviceFormat(s.name) === 'Online' ? 'Available online.' : 'Available in person in Michigan and surrounding areas.'}</p>
                      <p className="max-w-3xl leading-relaxed text-muted-foreground">{s.blurb}</p>
                      <button onClick={() => choose(s.name)} className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground" data-testid={`button-enquire-${i}`}>
                        Enquire about this <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-primary px-5 py-24 text-primary-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -bottom-3 -right-3 h-full w-full border-2 border-accent" />
                <img src={`${BASE}meghan-walsh.jpg`} alt="Megan Walsh, spiritual practitioner and ordained minister" width={576} height={1024} loading="lazy" decoding="async" className="relative aspect-[4/5] w-full object-cover object-[50%_25%]" data-testid="img-meghan" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[hsl(36_70%_70%)]">About</p>
              <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Megan Walsh, ordained minister</h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-primary-foreground/90" data-testid="text-about">
                <p>Through Reiki energy healing, intuitive tarot and palm readings, mediumship and ordained ministry, I offer personalised experiences to support your spiritual journey, encourage inner peace and bring fresh perspective to life’s transitions.</p>
                <p>As an ordained minister, I am devoted to serving others through love, compassion, spiritual guidance and healing. I believe in the power of love, faith and the healing spirit to bring hope, balance and transformation into people’s lives.</p>
                <p className="font-serif text-xl font-semibold italic text-[hsl(36_70%_70%)]">Your journey, your healing, your spiritual connection.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative px-5 py-24">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">Contact</p>
              <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                Tell me a little about <em className="text-accent">you</em>
              </h2>
              <p className="mt-6 text-muted-foreground">Send a note and choose the service you are curious about. There is no obligation.</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">Online: Perfect Day Consults, Mediumship Readings and Intuitive Tarot Readings. For all other services, I welcome in-person enquiries in Michigan and surrounding areas.</p>
              <p className="mt-6 rounded-md border-l-4 border-accent bg-secondary p-4 text-sm text-secondary-foreground" data-testid="text-storage-note">
                Your enquiry is sent to Megan through Web3Forms. Please do not include sensitive health information.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <form onSubmit={submit} className="space-y-5 rounded-md border-2 border-primary bg-card p-6 sm:p-8" data-testid="form-enquiry">
                <input type="checkbox" name="botcheck" checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />
                <fieldset disabled={isPending} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">Name</label>
                  <input id="name" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className={field} data-testid="input-name" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email</label>
                  <input id="email" type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className={field} data-testid="input-email" />
                </div>
                <div>
                  <label htmlFor="service" className="mb-1.5 block text-sm font-semibold">Service</label>
                  <select id="service" value={service} onChange={(e) => setService(e.target.value as Service)} className={field} data-testid="select-service">
                    {SERVICES.map((s) => (
                      <option key={s.name} value={s.name}>{s.name} — {serviceFormat(s.name)}</option>
                    ))}
                    <option value="General enquiry">General enquiry</option>
                  </select>
                  {service !== 'General enquiry' && (
                    <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
                      {serviceFormat(service) === 'Online' ? 'This service is offered online.' : 'This service is offered in person in Michigan and surrounding areas.'}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">Message</label>
                  <textarea id="message" required rows={5} maxLength={3000} value={message} onChange={(e) => setMessage(e.target.value)} className={field} data-testid="input-message" />
                </div>
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[hsl(232_45%_22%)]" data-testid="checkbox-consent" />
                  <span>
                    I agree to my details being processed to respond to this enquiry.{' '}
                    <a href={`${BASE}privacy-policy/`} className="font-semibold text-primary underline underline-offset-2" data-testid="link-consent-privacy">Privacy policy</a>
                  </span>
                </label>
                <button type="submit" disabled={isPending || !consent} className="w-full rounded-md bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50" data-testid="button-submit">
                  {isPending ? 'Sending your enquiry...' : 'Send enquiry'}
                </button>
                </fieldset>
                <div aria-live="polite">
                  {receipt && (
                    <p className="rounded-md border-l-4 border-accent bg-secondary p-4 text-sm" data-testid="text-receipt">{receipt}</p>
                  )}
                  {isError && (
                    <p className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive" role="alert" data-testid="text-error">
                      We could not confirm your enquiry was sent. Your details are still here; please try again in a moment.
                    </p>
                  )}
                </div>
              </form>
            </Reveal>
          </div>
        </section>

        <ShopSection wrap={(c, d) => <Reveal delay={d}>{c}</Reveal>} />
      </main>

      <footer className="bg-[hsl(232_45%_14%)] text-primary-foreground px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Mark className="w-14 rounded bg-background p-1" />
            <span className="font-serif text-xl font-bold text-primary-foreground">Spiritual in the Physical</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="hover:text-white" data-testid={`link-footer-${l.toLowerCase()}`}>{l}</a>
            ))}
          </nav>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
            <a href={`${BASE}privacy-policy/`} className="hover:text-white" data-testid="link-footer-privacy">Privacy Policy</a>
            <a href={`${BASE}terms/`} className="hover:text-white" data-testid="link-footer-terms">Terms</a>
            <a href={`${BASE}disclosures/`} className="hover:text-white" data-testid="link-footer-disclosures">Disclosures</a>
          </nav>
          <p className="text-xs text-primary-foreground/70">&copy; {new Date().getFullYear()} Megan Walsh. Spiritual in the Physical.</p>
        </div>
      </footer>
    </div>
  );
}
