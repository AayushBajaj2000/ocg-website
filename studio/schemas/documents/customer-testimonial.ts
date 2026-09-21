import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'customerTestimonial',
    title: 'Customer Testimonials',
    type: 'document',
    icon: () => '💬',
    orderings: [
        {
            title: 'Display order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'company',
            customerName: 'customerName',
            customerPosition: 'customerPosition',
            media: 'logo',
        },
        prepare({ title, customerName, customerPosition, media }) {
            return {
                title,
                subtitle: customerName
                    ? [customerName, customerPosition]
                          .filter(Boolean)
                          .join(', ')
                    : 'Logo only (no testimonial yet)',
                media,
            }
        },
    },
    fields: [
        defineField({
            name: 'company',
            title: 'Company',
            description: 'The customer’s company name, as it should be read out.',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            description:
                'The company logo in full colour, as an SVG with no background. It is shown at the size the SVG is drawn at, so keep it around 24–40px tall.',
            type: 'image',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'order',
            title: 'Order',
            description:
                'Order in which the logo should appear on the website (ascending order).',
            type: 'number',
        }),
        defineField({
            name: 'customerName',
            title: 'Customer Name',
            description:
                'The first and last name of the customer, plus any designations. Leave the customer fields empty to show the logo without a testimonial.',
            type: 'string',
        }),
        defineField({
            name: 'customerPosition',
            title: 'Customer Position',
            description: 'The customer’s position at their company.',
            type: 'string',
        }),
        defineField({
            name: 'testimonial',
            title: 'Testimonial',
            description: 'The testimonial quote from the customer.',
            type: 'text',
            rows: 4,
            validation: (Rule) =>
                Rule.custom((value, context) => {
                    const hasName = Boolean(
                        (context.document as { customerName?: string })
                            ?.customerName
                    )
                    if (hasName && !value)
                        return 'Add the testimonial, or clear the customer name.'
                    if (!hasName && value)
                        return 'Add the customer’s name for this testimonial.'
                    return true
                }),
        }),
        defineField({
            name: 'customerPhoto',
            title: 'Customer Photo',
            description: 'Optional. A square photo of the customer.',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
})
