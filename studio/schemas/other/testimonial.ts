import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'testimonial',
    title: 'Testimonial',
    type: 'object',
    icon: () => '🌟',
    preview: {
        select: {
            title: 'clientName',
            subtitle: 'project.title',
            media: 'clientAvatar',
        },
        prepare({ title, subtitle, media }) {
            return {
                title,
                subtitle,
                media,
            }
        },
    },
    fields: [
        defineField({
            name: 'clientName',
            title: 'Client Name',
            description:
                'The first and last name of the client, plus any designations.',
            type: 'string',
        }),
        defineField({
            name: 'clientRole',
            title: 'Client Role',
            description: 'The role of the client at their company.',
            type: 'string',
        }),
        defineField({
            name: 'clientLogo',
            title: 'Client Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
            description:
                'Upload the logo of the client as either a PNG or SVG with no background. Make sure the logo is white or it will appear incorrectly on the website.',
        }),
        defineField({
            name: 'quote',
            title: 'Quote',
            description: 'The testimonial quote from the client.',
            type: 'text',
            validation: (Rule) =>
                Rule.required()
                    .min(1)
                    .max(300)
                    .error('Must be 1-300 characters.'),
        }),
        defineField({
            name: 'clientAvatar',
            title: 'Client Avatar',
            type: 'image',
            description:
                'Upload an image of the client. Make sure the image is square.',
        }),
    ],
})
