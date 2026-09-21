import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'projectAndToolsUsed',
    title: 'Project and Tools Used',
    type: 'object',
    icon: () => '🛠️',
    preview: {
        prepare: () => ({
            title: 'The Project and Tools Used',
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
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'toolsUsed',
            title: 'Tools Used',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'technology' }] }],
        }),
    ],
})
