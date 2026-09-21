import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
    name: 'resources',
    title: 'Resources',
    type: 'document',
    icon: () => '📝',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The title/name of the resource.',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            description:
                'The slug that will be seen in the URL for this resource. Best to generate this.',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            // @ts-ignore
            of: [{ type: 'string' }],
            options: {
                list: ['Design', 'Development'],
            },
            description: 'The main type of this resource',
        }),
        defineField({
            name: 'subCategory',
            title: 'Subcateogory',
            type: 'string',
            description:
                'A low-level filter for this resource (i.e. Lottie, React, Vector).',
        }),
        defineField({
            name: 'description',
            title: 'Short Description',
            type: 'string',
            description:
                'This is the short one-line description that will be shown on the outer resource page',
        }),
        defineField({
            name: 'image',
            title: 'Thumbnail',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required().error('Required'),
            description:
                'The thumbnail image that is displayed on the outer resource page.',
        }),
        defineField({
            name: 'overview',
            title: 'Overview',
            type: 'blockContent',
            description:
                'The main description/overview of this resource. Include all details, specifications, and usage information here.',
        }),
        defineField({
            name: 'license',
            title: 'License',
            type: 'blockContent',
            description:
                'Include license and usage rights here. If unknown, just enter "MIT"',
        }),
        defineField({
            name: 'preview',
            title: 'Preview',
            type: 'image',
            validation: (Rule) => Rule.required().error('Required'),
            description: 'An image preview of this asset/resource',
        }),
        defineField({
            name: 'downloadURL',
            title: 'Download URL',
            type: 'url',
            description:
                'The URL where the asset can be downloaded. Should either be a Figma URL or a Google Drive URL. Leave blank for code components.',
        }),
        // defineField({
        //     name: 'files',
        //     title: 'Resource files',
        //     type: 'array',
        //     // @ts-ignore
        //     of: [
        //         defineArrayMember({
        //             name: 'resourceFiles',
        //             title: 'Resource Files',
        //             type: 'resourceFiles',
        //         }),
        //     ],
        // }),
        defineField({
            name: 'code',
            title: 'Code',
            type: 'code',
            description: 'The code for this component (optional).',
        }),
    ],
})
