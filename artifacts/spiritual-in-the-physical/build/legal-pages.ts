export interface LegalSection {
  heading: string;
  paragraphs: string[];
}
export interface LegalPage {
  path: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

export const LEGAL_PAGES: LegalPage[] = [
  {
    path: 'privacy-policy',
    title: 'Privacy Policy',
    description:
      'How Spiritual in the Physical, operated by Megan Walsh, handles information submitted through the enquiry form and the site.',
    sections: [
      {
        heading: 'Who operates this site',
        paragraphs: [
          'This site, Spiritual in the Physical, is operated by Megan Walsh. Services are offered in Michigan and surrounding areas, with Perfect Day Consults, Tarot and Mediumship readings available online.',
          'This policy describes how information is handled when you use the website.',
        ],
      },
      {
        heading: 'Information you send us',
        paragraphs: [
          'When you submit the contact form, your name, email address, chosen service, message and consent are sent to Web3Forms to deliver your enquiry to Megan by email.',
          'New enquiries are not saved in this website’s project database. Web3Forms processes submissions, and Megan’s email provider handles the delivered messages. Any enquiries previously submitted through the earlier database-backed form may remain in that database.',
          'Please do not include sensitive health or medical details in the general contact form.',
        ],
      },
      {
        heading: 'Consultation intake information',
        paragraphs: [
          'A separate, unlisted Perfect Day Consult intake form asks for contact details and information about health history, symptoms, relationships, emotional health, lifestyle and consultation goals. Only the fields marked as required must be answered.',
          'If you submit that intake form, its answers are sent through Web3Forms to Megan by email to help prepare for your consultation. They are not saved to this website’s project database or to browser storage. Web3Forms and the email providers process and may retain these answers under their own policies and account settings.',
          'The intake link is not included in site navigation or the sitemap, and the page asks search engines not to index it. This is not access control: anyone with the link can open it. Do not use the form for emergencies. Contact Megan before submitting if you need a different way to share sensitive information.',
        ],
      },
      {
        heading: 'Why we use it',
        paragraphs: [
          'We use enquiry information to respond to you, intake information to prepare for your consultation, and technical information to help prevent spam and misuse of the forms.',
        ],
      },
      {
        heading: 'Technical data and hosting',
        paragraphs: [
          'Our hosting provider may log requests to the site. Web3Forms receives technical request data, such as your IP address, when you submit the form and may use it to prevent spam and abuse.',
          'No custom analytics or advertising pixels have been implemented on this site.',
        ],
      },
      {
        heading: 'Third-party resources',
        paragraphs: [
          'The site loads fonts (Manrope and Fraunces) from Google Fonts. Product images in the shop section load from dod.live and the Shopify CDN. When your browser requests these resources, the providers receive your IP address and ordinary request data, and handle it under their own policies.',
          'Shop links lead to an external seller. Please see the Disclosures page for affiliate details. This site has no local checkout and does not collect payment data.',
        ],
      },
      {
        heading: 'Service providers',
        paragraphs: [
          'Information may be handled by providers supplying hosting, Web3Forms form processing, and email delivery and storage. Web3Forms handles submissions under its privacy policy at https://web3forms.com/privacy.',
        ],
      },
      {
        heading: 'Retention',
        paragraphs: [
          'Enquiries in Megan’s mailbox and any earlier website database records are kept for as long as needed to handle your enquiry and for legal needs. Web3Forms may also retain submissions under its own policies and account settings; its published default retention is three years, with shorter retention settings available.',
        ],
      },
      {
        heading: 'Your requests',
        paragraphs: [
          'You may ask to access, correct or delete information you submitted by using the contact form on the home page, subject to applicable law. Please mention that your message is a privacy request.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'This policy will be updated when the way information is processed changes.',
        ],
      },
    ],
  },
  {
    path: 'terms',
    title: 'Terms of Use',
    description:
      'Terms for using the Spiritual in the Physical website and enquiring about services with Megan Walsh.',
    sections: [
      {
        heading: 'About these terms',
        paragraphs: [
          'These terms apply to your use of the Spiritual in the Physical website, operated by Megan Walsh.',
        ],
      },
      {
        heading: 'Informational and spiritual services',
        paragraphs: [
          'This site provides information about wellness and spiritual services. Nothing here is medical advice, and nothing is offered to diagnose, treat or cure any condition. No outcome is guaranteed.',
          'Please consult a qualified healthcare professional for medical concerns.',
        ],
      },
      {
        heading: 'Enquiries are not bookings',
        paragraphs: [
          'Submitting the contact form is an enquiry only. It is not a booking and does not create a payment obligation. Services and pricing are agreed separately.',
        ],
      },
      {
        heading: 'External sellers and links',
        paragraphs: [
          'Purchases made through external links are governed by the seller\u2019s own terms, including pricing, shipping, returns and product claims.',
        ],
      },
      {
        heading: 'Your use of the site',
        paragraphs: [
          'Please use the contact form honestly and do not submit spam, unlawful material, or sensitive medical details.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: ['These terms may be updated from time to time.'],
      },
    ],
  },
  {
    path: 'disclosures',
    title: 'Disclosures',
    description:
      'Affiliate, medical and reading disclosures for Spiritual in the Physical.',
    sections: [
      {
        heading: 'Affiliate compensation',
        paragraphs: [
          'Some shop links are DOD affiliate links containing a bg_ref reference. If you buy through them, Megan Walsh may earn a commission.',
          'The seller controls its cookies, purchases, pricing, shipping, returns and product claims. This site has no local checkout and handles no payment data.',
        ],
      },
      {
        heading: 'Not medical advice',
        paragraphs: [
          'Nothing on this site is medical advice or a diagnosis, treatment or cure for any condition.',
        ],
      },
      {
        heading: 'Supplements',
        paragraphs: [
          'Supplements and wellness products are not a substitute for professional care. Consult a qualified clinician before use and read product labels carefully.',
        ],
      },
      {
        heading: 'Readings',
        paragraphs: [
          'Tarot, palm, mediumship and similar readings are offered for reflection and spiritual guidance. Accuracy and outcomes are not guaranteed.',
        ],
      },
    ],
  },
];

const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const CSS = `
:root{--bone:hsl(40,33%,95%);--navy:hsl(232,45%,22%);--ink:hsl(232,40%,14%);--brass:hsl(34,55%,40%);--rule:hsl(36,20%,80%);--muted:hsl(232,15%,30%)}
*{box-sizing:border-box}
body{margin:0;background:var(--bone);color:var(--ink);font-family:"Segoe UI",system-ui,-apple-system,sans-serif;line-height:1.7;font-size:1.0625rem}
a{color:var(--navy);text-underline-offset:3px}
a:hover{color:var(--brass)}
a:focus-visible{outline:2px solid var(--brass);outline-offset:3px}
header{background:var(--navy);color:var(--bone);padding:1.25rem 1.25rem}
.wrap{max-width:46rem;margin:0 auto}
header .wrap{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
header a{color:var(--bone);font-family:Georgia,"Times New Roman",serif;font-weight:700;text-decoration:none}
main{padding:3.5rem 1.25rem 3rem}
.kicker{margin:0 0 1rem;padding-left:.75rem;border-left:2px solid var(--brass);font-size:.75rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--navy)}
h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.25rem,7vw,3.5rem);line-height:1.05;letter-spacing:-.01em;color:var(--navy);margin:0 0 1rem}
h2{font-family:Georgia,"Times New Roman",serif;font-size:1.5rem;color:var(--navy);margin:2.5rem 0 .5rem;padding-top:1rem;border-top:1px solid var(--rule)}
p{margin:.75rem 0;color:var(--muted)}
.lede{color:var(--ink);font-weight:500}
footer{background:var(--navy);color:var(--bone);padding:2rem 1.25rem;font-size:.9rem}
footer a{color:var(--bone)}
footer ul{list-style:none;margin:0 0 1rem;padding:0;display:flex;flex-wrap:wrap;gap:.5rem 1.5rem}
footer p{color:var(--bone);opacity:.8;margin:0}
`;

export function renderLegalPage(page: LegalPage, head: string, base: string): string {
  const b = esc(base);
  const nav = LEGAL_PAGES.map((p) => {
    const current = p.path === page.path ? ' aria-current="page"' : '';
    return `<li><a href="${b}${esc(p.path)}/"${current}>${esc(p.title)}</a></li>`;
  }).join('');
  const body = page.sections
    .map(
      (s) =>
        `<section><h2>${esc(s.heading)}</h2>${s.paragraphs.map((t) => `<p>${esc(t)}</p>`).join('')}</section>`,
    )
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${head}
<style>${CSS}</style>
</head>
<body>
<header><div class="wrap"><a href="${b}">Spiritual in the Physical</a><a href="${b}">Back to site</a></div></header>
<main><div class="wrap">
<p class="kicker">Megan Walsh</p>
<h1>${esc(page.title)}</h1>
<p class="lede">${esc(page.description)}</p>
${body}
</div></main>
<footer><div class="wrap"><nav aria-label="Legal"><ul>${nav}</ul></nav><p>&copy; ${new Date().getFullYear()} Megan Walsh. Spiritual in the Physical.</p></div></footer>
</body>
</html>
`;
}
