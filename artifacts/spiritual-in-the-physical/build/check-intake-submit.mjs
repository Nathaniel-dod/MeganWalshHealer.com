import assert from 'node:assert/strict';
import { submitIntake } from '../src/lib/submit-intake.ts';

// Fully offline: no real Web3Forms requests or emails.
const intake = { name: ' Sample Client ', email: ' client@example.com ', message: 'SECTION 1 — About You\nSample answers', botcheck: false };
let sent = 0;
await submitIntake(intake, async (url, options) => {
  sent++;
  assert.equal(url, 'https://api.web3forms.com/submit');
  const body = JSON.parse(options.body);
  assert.equal(body.name, 'Sample Client');
  assert.equal(body.email, 'client@example.com');
  assert.equal(body.message, intake.message);
  assert.equal(body.subject, 'Perfect Day Consult — Client Intake');
  assert.equal(body.botcheck, false);
  assert.ok(options.signal);
  return Response.json({ success: true });
});
assert.equal(sent, 1);
for (const result of [
  Response.json({ success: false }),
  Response.json({ success: true }, { status: 429 }),
  Response.json({ message: 'Unexpected response' }),
  new Response('Bad Gateway', { status: 502 }),
]) {
  await assert.rejects(submitIntake(intake, async () => result));
}
await assert.rejects(submitIntake(intake, async () => { throw new Error('Network failed'); }));
let attempted = false;
await assert.rejects(submitIntake({ ...intake, botcheck: true }, async () => { attempted = true; }));
assert.equal(attempted, false);
console.log('Intake submission offline checks passed; no data sent.');
