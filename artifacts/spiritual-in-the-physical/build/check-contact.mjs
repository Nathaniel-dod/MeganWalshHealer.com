import assert from 'node:assert/strict';
import { submitEnquiry } from '../src/lib/submit-enquiry.ts';

// Offline contract checks only: never contact Web3Forms or send an email.
const enquiry = {
  name: ' Example ', email: ' example@example.com ', service: 'Perfect Day Consults',
  message: ' An enquiry ', consent: true, botcheck: false,
};
let calls = 0;
await submitEnquiry(enquiry, async (url, options) => {
  calls++;
  assert.equal(url, 'https://api.web3forms.com/submit');
  assert.equal(options.method, 'POST');
  const body = JSON.parse(options.body);
  assert.equal(body.name, 'Example');
  assert.equal(body.email, 'example@example.com');
  assert.equal(body.message, 'An enquiry');
  assert.equal(body.service, enquiry.service);
  assert.equal(body.botcheck, false);
  assert.match(body.access_key, /^[a-f0-9-]{36}$/);
  assert.ok(options.signal);
  return Response.json({ success: true });
});
assert.equal(calls, 1);
for (const response of [
  Response.json({ success: false }),
  Response.json({ success: true }, { status: 429 }),
  Response.json({ message: 'Unexpected shape' }),
  new Response('Not JSON', { status: 502 }),
]) {
  await assert.rejects(submitEnquiry(enquiry, async () => response));
}
await assert.rejects(submitEnquiry(enquiry, async () => { throw new Error('Network error'); }));
const mustNotSend = async () => { throw new Error('Should not call network'); };
await assert.rejects(submitEnquiry({ ...enquiry, botcheck: true }, mustNotSend), /Invalid submission/);
await assert.rejects(submitEnquiry({ ...enquiry, consent: false }, mustNotSend), /Invalid submission/);
await assert.rejects(submitEnquiry({ ...enquiry, message: ' ' }, mustNotSend), /required fields/);
console.log('Offline contact checks passed. No submissions sent.');
