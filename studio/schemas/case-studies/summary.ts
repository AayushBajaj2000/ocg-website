import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'summary',
    title: 'Summary',
    type: 'object',
    icon: () => '📝',
    preview: {
        prepare: () => ({
            title: 'Summary',
            subtitle: 'Click to edit',
        }),
    },
    fields: [
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'industry',
            title: 'Industry',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'services',
            title: 'Services',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'results',
            title: 'Results',
            type: 'array',
            of: [{ type: 'result' }],
            validation: (Rule) => Rule.required().error('Required'),
        }),
    ],
})
