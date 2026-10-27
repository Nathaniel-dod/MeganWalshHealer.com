// Public Web3Forms form identifier. Recipient is configured in Megan's account.
const ACCESS_KEY = '024d86af-9806-406c-9f82-1c6a14757dc1';

export async function submitIntake(
  intake: { name: string; email: string; message: string; botcheck: boolean },
  request: typeof fetch = fetch,
): Promise<void> {
  if (intake.botcheck || !intake.name.trim() || !intake.email.trim() || !intake.message.trim()) {
    throw new Error('Please complete the required fields.');
  }
  const response = await request('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: 'Perfect Day Consult — Client Intake',
      from_name: 'Spiritual in the Physical',
      name: intake.name.trim(),
      email: intake.email.trim(),
      message: intake.message,
      botcheck: false,
    }),
    signal: AbortSignal.timeout(30000),
  });
  const result: unknown = await response.json();
  if (!response.ok || !result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
    throw new Error('We could not confirm your intake was sent. Your answers are still here; please try again.');
  }
}
