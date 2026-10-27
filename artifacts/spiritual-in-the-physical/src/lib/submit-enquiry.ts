// Web3Forms access keys are public form identifiers, not private API credentials.
const ACCESS_KEY = '024d86af-9806-406c-9f82-1c6a14757dc1';

export async function submitEnquiry(
  enquiry: { name: string; email: string; service: string; message: string; consent: boolean; botcheck: boolean },
  request: typeof fetch = fetch,
) {
  if (enquiry.botcheck || !enquiry.consent) throw new Error('Invalid submission');
  if (!enquiry.name.trim() || !enquiry.email.trim() || !enquiry.message.trim()) {
    throw new Error('Please complete all required fields');
  }
  const response = await request('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `Spiritual in the Physical — ${enquiry.service}`,
      from_name: 'Spiritual in the Physical',
      name: enquiry.name.trim(),
      email: enquiry.email.trim(),
      service: enquiry.service,
      message: enquiry.message.trim(),
      consent: 'I agree to my details being processed to respond to this enquiry.',
      botcheck: false,
    }),
    signal: AbortSignal.timeout(20000),
  });
  const result: unknown = await response.json();
  if (!response.ok || !result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
    throw new Error('Submission was not accepted');
  }
}
