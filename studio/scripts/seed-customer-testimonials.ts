// One-off seed: creates the Customer Testimonials documents from the logos used on the new site
// and the testimonials already stored on `project` documents.
// Run from /studio: npx sanity exec scripts/seed-customer-testimonials.ts --with-user-token
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2025-02-19' })
const LOGO_DIR = process.env.LOGO_DIR as string

// Grid order on the site. `project` is the slug of the project holding the testimonial today.
const CUSTOMERS = [
    { key: 'taurus', company: 'Taurus Contracting', file: 'taurus.svg', project: 'taurus-contracting' },
    { key: 'bgis', company: 'BGIS', file: 'bgis.svg' },
    { key: 'efundrs', company: 'eFundrs', file: 'efunders.svg', project: 'efundrs' },
    { key: 'fraiche-table', company: 'Fraîche Table', file: 'fraichetable.svg', project: 'fraiche-table' },
    { key: 'eclectic-events', company: 'Eclectic Events', file: 'eclectic.svg', project: 'eclectic-events' },
    { key: 'campus-gate', company: 'Campus Gate Residences', file: 'campus-gate.svg' },
    { key: 'beegirls', company: 'Beegirl’s', file: 'beegirls.svg' },
    { key: 'anesthesia-one', company: 'Anesthesia One', file: 'ao.svg', project: 'anesthesia-one' },
    { key: 'dr-whiff', company: 'Dr. Whiff', file: 'dr-whiff.svg' },
    { key: 'page-flooring', company: 'Page Flooring', file: 'pageflooring.svg', project: 'page-flooring' },
    { key: 'dentimatch', company: 'DentiMatch', file: 'dentimatch.svg', project: 'dentimatch' },
]

// Hard-wrapped lines become one paragraph; blank lines stay as paragraph breaks.
const tidy = (text?: string) =>
    text
        ?.split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n\n')

const run = async () => {
    const projects: Array<{
        slug: string
        t?: { clientName?: string; clientRole?: string; quote?: string; clientAvatar?: { asset?: { _ref: string } } }
    }> = await client.fetch(`*[_type == "project"]{"slug": slug.current, "t": testimonial}`)

    for (const [index, customer] of CUSTOMERS.entries()) {
        const logo = await client.assets.upload(
            'image',
            createReadStream(path.join(LOGO_DIR, customer.file)),
            { filename: `${customer.key}-logo.svg`, contentType: 'image/svg+xml' }
        )
        const t = projects.find((p) => p.slug === customer.project)?.t
        const photoRef = t?.clientAvatar?.asset?._ref

        await client.createOrReplace({
            _id: `customerTestimonial-${customer.key}`,
            _type: 'customerTestimonial',
            company: customer.company,
            order: index + 1,
            logo: { _type: 'image', asset: { _type: 'reference', _ref: logo._id } },
            ...(t?.quote && {
                customerName: t.clientName?.trim(),
                customerPosition: t.clientRole?.trim(),
                testimonial: tidy(t.quote),
            }),
            ...(t?.quote && photoRef && {
                customerPhoto: { _type: 'image', asset: { _type: 'reference', _ref: photoRef } },
            }),
        })
        console.log(`${customer.company}: ${t?.quote ? `testimonial from ${t.clientName}` : 'logo only'}`)
    }
}

run().catch((error) => {
    console.error(error)
    process.exit(1)
})
