export type FieldKind = 'text' | 'email' | 'tel' | 'number' | 'long' | 'single' | 'multi' | 'symptom';

export interface IntakeQuestion {
  id: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  hint?: string;
  options?: readonly string[];
  defaultValue?: string;
}

export interface IntakeSection {
  id: string;
  number: number;
  title: string;
  instruction?: string;
  questions: IntakeQuestion[];
}

export const SYMPTOM_OPTIONS = ['Not an issue', 'Acute', 'Severe', 'Chronic'] as const;
const DIGEST_DAYS = ['3 out of 3 days', '2 out of 3 days', '1 out of 3 days', 'Never'] as const;
const BODY_HINT = 'List all the parts of the body that may have these';

const SYMPTOMS = [
  'Low back pain', 'Hip pain', 'Swollen legs or feet', 'Varicose veins', 'Bladder infections',
  'Yeast infections', 'Toe fungus', 'Endometriosis', 'Hemorrhoids', 'Ovarian cysts', 'Fibroids',
  'Tumors', 'Pain during or after lovemaking', 'Low libido, loss of sex drive', 'Heavy periods',
  'Irregular periods', 'PMS', 'Menopause', 'Leaky gut', 'Constipation', 'Stool leakage',
  'Incontinence', 'Frequent need to pee', 'Hysterectomy', 'Cesarian section', 'Postpartum recovery',
  'Infertility', 'Vaginitis', 'Vaginismus', 'Vaginal dryness', 'Pelvic organ prolapse',
  'Pain in the pelvic area',
];

type Q = Omit<IntakeQuestion, 'id'>;
const sec = (n: number, title: string, qs: Q[], instruction?: string): IntakeSection => ({
  id: `s${n}`,
  number: n,
  title,
  instruction,
  questions: qs.map((q, i) => ({ ...q, id: `s${n}q${i + 1}` })),
});

export const INTAKE_SECTIONS: IntakeSection[] = [
  sec(1, 'About You', [
    { label: 'Full Name', kind: 'text', required: true },
    { label: 'Email', kind: 'email', required: true },
    { label: 'Phone Number', kind: 'tel', required: true },
    { label: 'Gender', kind: 'text' },
    { label: 'Age', kind: 'number', hint: 'Numbers only.' },
    { label: 'Blood Type', kind: 'single', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not sure'] },
    { label: 'Weight (in lbs)', kind: 'number', hint: 'Numbers only' },
    { label: 'Height (in feet)', kind: 'text', hint: 'Examples: 4 FT 7, 5 FT 2, etc.' },
  ]),
  sec(2, 'Purpose, Goals & Fears', [
    { label: 'Purpose of Consultation', kind: 'long', required: true },
    { label: 'Your Top 3 Goals — Goal 1', kind: 'text' },
    { label: 'Goal 2', kind: 'text' },
    { label: 'Goal 3', kind: 'text' },
    { label: 'Your 3 Greatest Fears — Fear 1', kind: 'text' },
    { label: 'Fear 2', kind: 'text' },
    { label: 'Fear 3', kind: 'text' },
  ]),
  sec(3, 'Health History', [
    { label: 'Are you pregnant?', kind: 'single', options: ['Yes', 'No', 'Not applicable'] },
    { label: 'If yes, how far along and what high-risk factors do you have?', kind: 'long' },
    { label: 'Do you experience chronic pain?', kind: 'single', options: ['Yes', 'No'] },
    { label: 'If so, explain what makes it better.', kind: 'long' },
    { label: 'Have you had any orthopedic injuries? If so, explain.', kind: 'long' },
    { label: 'Tell us about your health history', kind: 'long', hint: 'Cancer, arthritis, joint replacements, strokes, etc.' },
    { label: 'Do you have any internal pins, wires, artificial joints or special equipment?', kind: 'long' },
    { label: 'Dental history?', kind: 'long' },
    { label: 'What symptoms are you feeling?', kind: 'long' },
    { label: 'Have you had a vaccination in the last three years? If so, please list the names.', kind: 'long' },
  ]),
  sec(
    4,
    'Pelvic Area Symptoms',
    SYMPTOMS.map((label) => ({ label, kind: 'symptom' as const, options: SYMPTOM_OPTIONS, defaultValue: 'Not an issue' })),
    'Please mark only the ones that bother you now or have in the past. Acute means it has just recently started; Severe means it has been an annoyance for a short while; Chronic means it has been annoying you for a long time.',
  ),
  sec(5, 'Relationships & Emotional Health', [
    { label: 'Would you say your relationships are healthy?', kind: 'long', hint: 'With friends and others? With yourself? With family?' },
    { label: 'Have you been emotionally abused?', kind: 'single', options: ['Yes', 'No', 'Prefer not to say'] },
    { label: 'Have you been physically abused?', kind: 'single', options: ['Yes', 'No', 'Prefer not to say'] },
    { label: 'Who do you live with?', kind: 'text' },
  ]),
  sec(6, 'Lifestyle & Environment', [
    { label: 'What EMFs are you exposed to daily?', kind: 'long' },
    { label: 'How many hours per day do you interact with a TV, cellphone, computer or tablet?', kind: 'text' },
    { label: 'What junk foods/treats do you use?', kind: 'long', hint: 'Alcohol, cigarettes, snacks, etc.' },
    { label: 'Are you or have you ever been exposed to mold?', kind: 'long' },
    { label: 'Are you or have you ever been exposed to heavy metals?', kind: 'long' },
    { label: 'Do you eat organic foods?', kind: 'single', options: ['Yes, mostly', 'Sometimes', 'Rarely or never'] },
    { label: 'How much water, and what kind, do you drink daily?', kind: 'long' },
    { label: 'What are your negative/toxic habits?', kind: 'long' },
    { label: 'What do you do in your spare time?', kind: 'long' },
    { label: 'Daily routine', kind: 'long', hint: 'In point form, list your daily routine from when you wake up until you go back to sleep. Include the bad habits you want to eliminate.' },
  ]),
  sec(7, 'Digestion', [
    { label: 'Are you constipated?', kind: 'single', options: DIGEST_DAYS },
    { label: 'Do you have diarrhea?', kind: 'single', options: DIGEST_DAYS },
    { label: 'Is it uneven formation? Is it hard or soft?', kind: 'text' },
    { label: 'How would you best describe your stool?', kind: 'single', options: ['Firm', 'Cracked', 'Smooth', 'Loose', 'Jagged'] },
    { label: 'How would you best describe its length?', kind: 'text', hint: 'Short clumps or long pieces' },
    { label: 'How would you best describe its thickness?', kind: 'single', options: ['Thicker than normal', 'Normal', 'Very skinny'] },
    { label: 'Does it float or does it sink?', kind: 'single', options: ['Floats', 'Sinks', 'Varies'] },
    { label: 'Does it have bubbles?', kind: 'single', options: ['Big bubbles', 'Small bubbles', 'No bubbles'] },
    { label: 'Does it contain blood or mucus?', kind: 'text' },
    { label: 'Does it slide easy or do you have to strain?', kind: 'text' },
    { label: 'How many bowel movements do you have a day?', kind: 'text' },
    {
      label: 'What times of the day do you have bowel movements?', kind: 'multi', hint: 'You can choose more than one',
      options: [
        'Early hours: 12am to 5am', 'Early morning: 5am to 9am', 'Mid-morning: 9am to 12pm',
        'After mid-day: 12pm to 4pm', 'Early evenings: 4pm to 7pm', 'Late evenings: 7pm to 10pm',
        'During the night: 10pm to 12am',
      ],
    },
  ], 'Please pick the best options as best you can remember, using the past three days.'),
  sec(8, 'Body Map & Anything Else', [
    { label: 'List all injuries, surgeries, and pain points of the body', kind: 'long' },
    ...['Adhesions', 'Fibroids', 'Crystallization', 'Calcification', 'Calcified tumor', 'Fatty tumor', 'Knots', 'Cysts', 'Scars']
      .map((label) => ({ label, kind: 'text' as const, hint: BODY_HINT })),
    { label: 'What else would you like to tell us?', kind: 'long', hint: 'Feel free to write whatever you want us to know about you!' },
  ]),
];

export type IntakeValues = Record<string, string | string[]>;

export const ALL_QUESTIONS = INTAKE_SECTIONS.flatMap((s) => s.questions);

export function initialValues(): IntakeValues {
  const v: IntakeValues = {};
  for (const q of ALL_QUESTIONS) v[q.id] = q.kind === 'multi' ? [] : q.defaultValue ?? '';
  return v;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMBER_RE = /^\d+(\.\d+)?$/;

export function validateIntake(values: IntakeValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const q of ALL_QUESTIONS) {
    const raw = values[q.id];
    const v = typeof raw === 'string' ? raw.trim() : '';
    if (q.required && !v) errors[q.id] = `${q.label} is required.`;
    else if (q.kind === 'email' && v && !EMAIL_RE.test(v)) errors[q.id] = 'Please enter a valid email address.';
    else if (q.kind === 'number' && v && !NUMBER_RE.test(v)) errors[q.id] = 'Numbers only.';
  }
  return errors;
}

export function serializeIntake(values: IntakeValues): string {
  const out: string[] = ['PERFECT DAY CONSULT INTAKE', ''];
  for (const s of INTAKE_SECTIONS) {
    out.push(`SECTION ${s.number} — ${s.title}`, '');
    s.questions.forEach((q, i) => {
      const raw = values[q.id];
      const answer = Array.isArray(raw)
        ? raw.length ? raw.join('; ') : 'Not provided'
        : raw && raw.trim() ? raw.trim() : 'Not provided';
      out.push(`${i + 1}. ${q.label}`, `   ${answer.replace(/\n/g, '\n   ')}`, '');
    });
  }
  return out.join('\n');
}
