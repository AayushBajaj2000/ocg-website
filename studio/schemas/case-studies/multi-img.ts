import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
    name: 'multiImageMockup',
    title: 'Multiple Image Mockup',
    type: 'object',
    icon: () => '🖼️',
    preview: {
        prepare: () => ({
            title: 'Multiple Image Mockup',
            subtitle: 'Click to edit',
        }),
    },
    fields: [
        defineField({
            name: 'color',
            title: 'Color',
            description:
                'The color of the background shown behind the image. Leave blank for transparent.',
            type: 'color',
            options: {
                disableAlpha: true,
            },
        }),
        defineField({
            name: 'mockupImages',
            title: 'Select Mockup Images',
            description:
                'The images to display. You can only add upto 5 images. Try to use a 16:9 aspect ratio.',
            type: 'array',
            // @ts-ignore
            of: [
                defineArrayMember({
                    name: 'image',
                    title: 'Mockup Image',
                    type: 'image',
                }),
            ],
        }),
        defineField({
            name: 'carousel',
            title: 'Carousel',
            description: 'Should the selected images appear in a carousel?',
            type: 'boolean',
            options: {
                layout: 'checkbox',
            },
        }),
        defineField({
            name: 'fourImgLayout2',
            title: 'Four image layout two',
            description: 'Should four images appear side by side?',
            type: 'boolean',
            options: {
                layout: 'checkbox',
            },
        }),
    ],
    initialValue: {
        carousel: false,
        fourImgLayout2: false,
    },
})
