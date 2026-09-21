import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'solution',
    title: 'The Solution',
    type: 'object',
    icon: () => '💡',
    preview: {
        prepare: () => ({
            title: 'The Solution',
            subtitle: 'Click to edit',
        }),
    },
    fields: [
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image' }],
            validation: (Rule) =>
                Rule.required().min(2).max(2).error('2 images required'),
        }),
    ],
})
