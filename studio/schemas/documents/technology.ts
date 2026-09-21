import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'technology',
    title: 'Technology',
    type: 'document',
    icon: () => '🔧',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
        }),
    ],
})
