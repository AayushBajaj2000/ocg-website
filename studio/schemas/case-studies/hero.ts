import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'hero',
    title: 'Hero',
    type: 'object',
    icon: () => '🦸‍♂️',
    preview: {
        prepare: () => ({
            title: 'Hero',
            subtitle: 'Click to edit',
        }),
    },
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            validation: (Rule) => Rule.required().error('Required'),
        }),
    ],
})
