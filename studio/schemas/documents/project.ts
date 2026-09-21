import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    icon: () => '🚀',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            description: 'This most likely will be the name of the client.',
            type: 'string',
            validation: (rule) =>
                rule
                    .required()
                    .min(1)
                    .max(80)
                    .error('Must be 1-80 characters.'),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'A short, captivating sentence about the project.',
            type: 'string',
            validation: (rule) =>
                rule
                    .required()
                    .min(1)
                    .max(80)
                    .error('Must be 1-80 characters.'),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            description:
                'This will be used to generate the URL for the project. Keep it short and sweet.',
            type: 'slug',
            options: {
                source: 'title',
            },
            validation: (rule) => rule.required().error('Required'),
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            validation: (rule) =>
                rule
                    .unique()
                    .min(1)
                    .max(3)
                    .required()
                    .error('Enter 1-3 unique tags.'),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            description:
                'Upload a high-quality image that represents the project.',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required().error('Required'),
        }),
        defineField({
            name: 'testimonial',
            title: 'Testimonial',
            description:
                'A testimonial that will be displayed on the home page, and in the case study.',
            type: 'testimonial',
        }),
    ],
})
