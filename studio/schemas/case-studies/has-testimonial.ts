import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'hasTestimonial',
    title: 'Has Testimonial',
    type: 'object',
    icon: () => '🌟',
    preview: {
        prepare: () => ({
            title: 'Testimonial',
            subtitle: 'Click to edit',
        }),
    },
    fields: [
        defineField({
            name: 'hasTestimonial',
            type: 'boolean',
            title: 'Has Testimonial',
            initialValue: false,
            description:
                'Only set this to true if the referenced project has a testimonial, otherwise the website will break.',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            description:
                'The company logo to be displayed with the testimonial in the case study.',
            validation: (Rule) => Rule.required().error('Required'),
        }),
    ],
})
