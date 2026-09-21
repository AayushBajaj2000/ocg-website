import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'resourceSpecs',
    title: 'Resource Specifications',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) =>
                Rule.required()
                    .min(1)
                    .max(300)
                    .error('1-300 characters required'),
        }),
    ],
})
