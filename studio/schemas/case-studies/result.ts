import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'result',
    title: 'Result',
    type: 'object',
    fields: [
        defineField({
            name: 'metric',
            title: 'Metric',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
    ],
})
