import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  INTAKE_SECTIONS, ALL_QUESTIONS, initialValues, validateIntake, serializeIntake,
} from '../src/data/intake.ts';

assert.deepEqual(INTAKE_SECTIONS.map(s => s.questions.length), [8, 7, 10, 32, 4, 10, 12, 11]);
assert.equal(ALL_QUESTIONS.length, 94);
assert.deepEqual(ALL_QUESTIONS.filter(q => q.required).map(q => q.id), ['s1q1', 's1q2', 's1q3', 's2q1']);
const values = initialValues();
assert.equal(Object.keys(validateIntake(values)).length, 4);
for (const q of INTAKE_SECTIONS[3].questions) {
  assert.equal(values[q.id], 'Not an issue');
  assert.deepEqual(q.options, ['Not an issue', 'Acute', 'Severe', 'Chronic']);
}
Object.assign(values, { s1q1: 'Sample Client', s1q2: 'sample@example.com', s1q3: '5550101234', s2q1: 'Sample purpose' });
assert.deepEqual(validateIntake(values), {});
assert.ok(validateIntake({ ...values, s1q2: 'invalid' }).s1q2);
for (const id of ['s1q5', 's1q7']) {
  assert.ok(validateIntake({ ...values, [id]: 'not a number' })[id]);
}
values.s7q12 = ['Early morning: 5am to 9am', 'Late evenings: 7pm to 10pm'];
values.s8q11 = 'Sample final answer';
const message = serializeIntake(values);
for (const section of INTAKE_SECTIONS) assert.ok(message.includes(`SECTION ${section.number} — ${section.title}`));
for (const q of ALL_QUESTIONS) assert.ok(message.includes(q.label));
assert.ok(message.includes('Sample final answer'));
assert.ok(message.includes('Early morning: 5am to 9am; Late evenings: 7pm to 10pm'));
assert.ok(message.includes('Not provided'));
const root = new URL('../dist/public/', import.meta.url);
const read = p => readFile(new URL(p, root), 'utf8');
const html = await read('consult-intake/index.html');
assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive">/);
assert.ok(!html.includes('max-image-preview:large'));
assert.ok(!html.includes('application/ld+json'));
assert.ok(!html.includes('id="shop"'));
assert.match(html, /data-testid="form-intake"/);
assert.equal((html.match(/data-testid="section-s\d"/g) || []).length, 8);
assert.equal((html.match(/required=""|required=""/g) || []).length >= 4, true);
assert.ok(!((await read('index.html')).includes('href="/consult-intake')));
assert.ok(!(await read('sitemap.xml')).includes('consult-intake'));
assert.match(await read('_headers'), /X-Robots-Tag: noindex, nofollow, noarchive/);
console.log('Intake checks passed: 94 questions, defaults, validation, email content, standalone static output and noindex.');
