import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'resourceFiles',
    title: 'Resource Files',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'link',
            title: 'Link',
            type: 'url',
        }),
        defineField({
            name: 'type',
            title: 'file type',
            type: 'string',
            // @ts-ignore
            of: [{ type: 'string' }],
            options: {
                list: ['PDF', 'PNG', 'DOCX'],
            },
        }),
    ],
})
