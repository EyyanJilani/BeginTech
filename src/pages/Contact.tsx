import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { PageHero } from '../components/sections/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { services } from '../data/services'
import { site } from '../data/site'
import { cn } from '../lib/utils'
import { useSeo } from '../hooks/useSeo'

const budgets = ['$1k – $5k', '$5k – $10k', '$10k – $25k', '$25k+', "Let's discuss"]

type Fields = {
  name: string
  email: string
  company: string
  phone: string
  service: string
  budget: string
  details: string
}

type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = {
  name: '',
  email: '',
  company: '',
  phone: '',
  service: '',
  budget: '',
  details: '',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+\d][\d\s().-]{6,}$/

function validate(values: Fields): Errors {
  const errors: Errors = {}

  if (values.name.trim().length < 2) errors.name = 'Please tell us your name.'
  if (!EMAIL.test(values.email.trim())) errors.email = 'A valid email address, so we can reply.'
  if (values.phone.trim() && !PHONE.test(values.phone.trim()))
    errors.phone = 'That phone number does not look right.'
  if (!values.service) errors.service = 'Pick the closest match — we can refine it later.'
  if (!values.budget) errors.budget = 'A rough range is enough.'
  if (values.details.trim().length < 24)
    errors.details = 'A couple of sentences about the project, please.'

  return errors
}

export default function Contact() {
  const [values, setValues] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useSeo({
    title: 'Contact — BeginTech',
    description:
      "Tell us what you're building. BeginTech replies within one business day. Based in Karachi, Pakistan and available for projects worldwide.",
    path: '/contact',
  })

  const set = (key: keyof Fields, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (touched[key]) {
      setErrors((e) => {
        const next = validate({ ...values, [key]: value })
        return { ...e, [key]: next[key] }
      })
    }
  }

  const blur = (key: keyof Fields) => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors((e) => ({ ...e, [key]: validate(values)[key] }))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({
      name: true,
      email: true,
      company: true,
      phone: true,
      service: true,
      budget: true,
      details: true,
    })

    const invalid = Object.keys(found) as (keyof Fields)[]
    if (invalid.length > 0) {
      // Focus by id rather than by [aria-invalid] — that attribute only appears
      // after React re-renders, which has not happened yet inside this handler.
      const first = invalid[0]
      const target =
        first === 'budget'
          ? document.querySelector<HTMLElement>('input[name="budget"]')
          : document.getElementById(first)
      target?.focus()
      return
    }

    // No backend is wired up in this build; the submission is acknowledged
    // locally so the flow can be reviewed end to end.
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 900)
  }

  const fieldClass = (key: keyof Fields) =>
    cn(
      'w-full border-b bg-transparent py-3.5 text-[0.9375rem] text-bone outline-none transition-colors duration-400 placeholder:text-mute-dim/70',
      errors[key] && touched[key] ? 'border-red-400/70' : 'border-line focus:border-accent',
    )

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build something
            <br />
            <span className="accent-em">extraordinary.</span>
          </>
        }
        lede="Tell us what you are working on. We read every enquiry ourselves and reply within one business day — including the ones we are not the right studio for."
        meta={[
          { label: 'Email', value: site.email },
          { label: 'Phone', value: site.phone },
          { label: 'Studio', value: site.location },
          { label: 'Hours', value: site.hours },
        ]}
      />

      <section className="border-t border-line py-20 md:py-28" aria-labelledby="enquiry-heading">
        <div className="shell">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            {/* Form */}
            <div className="lg:col-span-7">
              <h2 id="enquiry-heading" className="display-sm mb-3 text-bone">
                Project enquiry
              </h2>
              <p className="mb-12 text-sm text-mute">
                Fields marked with an asterisk are required.
              </p>

              {status === 'sent' ? (
                <div
                  role="status"
                  className="rounded-xl border border-accent/40 bg-accent/[0.06] p-10 text-center"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/50 text-accent">
                    <Check aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h3 className="mt-7 font-display text-2xl tracking-tight text-bone">
                    Thank you, {values.name.split(' ')[0]}.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
                    Your enquiry is with us. Expect a considered reply from a real person within one
                    business day — usually with a question or two before any proposal.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setValues(empty)
                      setErrors({})
                      setTouched({})
                      setStatus('idle')
                    }}
                    className="link-underline mt-8 text-sm text-bone"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-10">
                  <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
                    <Field
                      id="name"
                      label="Name"
                      required
                      error={touched.name ? errors.name : undefined}
                    >
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Okafor"
                        className={fieldClass('name')}
                        value={values.name}
                        onChange={(e) => set('name', e.target.value)}
                        onBlur={() => blur('name')}
                        aria-invalid={Boolean(touched.name && errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                    </Field>

                    <Field
                      id="email"
                      label="Email"
                      required
                      error={touched.email ? errors.email : undefined}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="jane@company.com"
                        className={fieldClass('email')}
                        value={values.email}
                        onChange={(e) => set('email', e.target.value)}
                        onBlur={() => blur('email')}
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                    </Field>

                    <Field id="company" label="Company">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Company or project name"
                        className={fieldClass('company')}
                        value={values.company}
                        onChange={(e) => set('company', e.target.value)}
                      />
                    </Field>

                    <Field id="phone" label="Phone" error={touched.phone ? errors.phone : undefined}>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+44 20 7946 0000"
                        className={fieldClass('phone')}
                        value={values.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        onBlur={() => blur('phone')}
                        aria-invalid={Boolean(touched.phone && errors.phone)}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                    </Field>
                  </div>

                  <Field
                    id="service"
                    label="What do you need"
                    required
                    error={touched.service ? errors.service : undefined}
                  >
                    <select
                      id="service"
                      name="service"
                      className={cn(fieldClass('service'), 'cursor-pointer appearance-none')}
                      value={values.service}
                      onChange={(e) => set('service', e.target.value)}
                      onBlur={() => blur('service')}
                      aria-invalid={Boolean(touched.service && errors.service)}
                      aria-describedby={errors.service ? 'service-error' : undefined}
                    >
                      <option value="" className="bg-ink">
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s.slug} value={s.title} className="bg-ink">
                          {s.title}
                        </option>
                      ))}
                      <option value="Something else" className="bg-ink">
                        Something else
                      </option>
                    </select>
                  </Field>

                  <fieldset
                    aria-invalid={Boolean(touched.budget && errors.budget)}
                    aria-describedby={errors.budget ? 'budget-error' : undefined}
                  >
                    <legend className="mb-5 text-[0.6875rem] uppercase tracking-[0.2em] text-mute-dim">
                      Budget <span className="text-accent">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                      {budgets.map((b) => (
                        <label
                          key={b}
                          className={cn(
                            'cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors duration-400',
                            values.budget === b
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-line text-mute hover:border-line-strong hover:text-bone',
                          )}
                        >
                          <input
                            type="radio"
                            name="budget"
                            value={b}
                            className="sr-only"
                            checked={values.budget === b}
                            onChange={() => {
                              set('budget', b)
                              setTouched((t) => ({ ...t, budget: true }))
                              setErrors((e) => ({ ...e, budget: undefined }))
                            }}
                          />
                          {b}
                        </label>
                      ))}
                    </div>
                    {touched.budget && errors.budget && (
                      <p id="budget-error" role="alert" className="mt-3 text-xs text-red-400">
                        {errors.budget}
                      </p>
                    )}
                  </fieldset>

                  <Field
                    id="details"
                    label="Project details"
                    required
                    error={touched.details ? errors.details : undefined}
                  >
                    <textarea
                      id="details"
                      name="details"
                      rows={5}
                      placeholder="What are you building, who is it for, and what has to be true for it to be a success?"
                      className={cn(fieldClass('details'), 'resize-none')}
                      value={values.details}
                      onChange={(e) => set('details', e.target.value)}
                      onBlur={() => blur('details')}
                      aria-invalid={Boolean(touched.details && errors.details)}
                      aria-describedby={errors.details ? 'details-error' : undefined}
                    />
                  </Field>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <Button type="submit" arrow disabled={status === 'sending'}>
                      {status === 'sending' ? (
                        <>
                          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        'Send Inquiry'
                      )}
                    </Button>
                    <p className="max-w-xs text-xs leading-relaxed text-mute-dim">
                      We reply within one business day. Your details are never shared or sold.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Details */}
            <aside className="lg:col-span-4 lg:col-start-9">
              <Reveal className="space-y-10">
                <div>
                  <p className="eyebrow mb-4">Direct</p>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <a href={`mailto:${site.email}`} className="link-underline text-bone">
                        {site.email}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
                        className="link-underline text-mute hover:text-bone"
                      >
                        {site.phone}
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="eyebrow mb-4">Headquarters</p>
                  <p className="text-sm leading-relaxed text-mute">{site.hq}</p>
                  <p className="mt-2 text-sm text-mute-dim">{site.location}</p>
                </div>

                <div>
                  <p className="eyebrow mb-4">Working hours</p>
                  <p className="text-sm text-mute">{site.hours}</p>
                  <p className="mt-2 flex items-center gap-2.5 text-sm text-mute-dim">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    {site.availability}
                  </p>
                </div>

                <div>
                  <p className="eyebrow mb-4">Elsewhere</p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {site.socials.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="link-underline text-sm text-mute hover:text-bone"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-surface/50 p-7">
                  <p className="font-display text-lg tracking-tight text-bone">
                    Prefer to talk it through?
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-mute">
                    Book a 30-minute call. No pitch deck — just questions about what you are trying
                    to build and whether we can help.
                  </p>
                  <a
                    href={`mailto:${site.email}?subject=Discovery%20call`}
                    className="link-underline mt-6 inline-block text-sm text-accent"
                  >
                    Request a discovery call
                  </a>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-[0.6875rem] uppercase tracking-[0.2em] text-mute-dim"
      >
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
