import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    icon: () => '📝',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            // @ts-ignore
            to: [{ type: 'teamMember' }],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            // @ts-ignore
            of: [{ type: 'string' }],
            options: {
                list: [
                    'Design',
                    'Development',
                    'Marketing',
                    'Techology',
                    'News',
                ],
            },
            validation: (rule) =>
                rule.required().custom((list: string[] | undefined) => {
                    if (!list || list.length > 3) {
                        return 'Please select between 1 and 3 tags'
                    }
                    return true
                }),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'date',
        }),
        defineField({
            name: 'pageContent',
            title: 'Page Content',
            type: 'blockContent',
        }),
    ],
    initialValue: {
        // set to current date in literal format
        createdAt: new Date().toISOString().split('T')[0],
    },
})
