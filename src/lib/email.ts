import emailjs from '@emailjs/browser'

/*
  EmailJS keeps these three IDs client-side by design (its "public key" is
  meant to be exposed in a browser bundle, gated by domain allow-listing and
  rate limits configured in the EmailJS dashboard — not by keeping the IDs
  secret). Still pulled from env vars rather than hard-coded so the actual
  values live in .env.local / Vercel project settings, not in git history.
*/
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export function isEmailConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)
}

export type EnquiryEmail = {
  name: string
  email: string
  company: string
  phone: string
  service: string
  budget: string
  details: string
}

/**
 * Sends the contact form straight from the browser via EmailJS — no backend
 * of our own to run or pay for. The destination inbox is configured inside
 * the EmailJS template itself (its "To email" field), not passed from here,
 * so the client can't redirect mail to an arbitrary address.
 */
export async function sendEnquiryEmail(fields: EnquiryEmail): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error(
      'Email is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY.',
    )
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: fields.name,
      from_email: fields.email,
      reply_to: fields.email,
      company: fields.company || '—',
      phone: fields.phone || '—',
      service: fields.service,
      budget: fields.budget,
      message: fields.details,
    },
    { publicKey: PUBLIC_KEY },
  )
}
