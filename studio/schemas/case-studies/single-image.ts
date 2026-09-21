import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'singleImageMockup',
    title: 'Single Image Mockup',
    type: 'object',
    icon: () => '🖼️',
    preview: {
        prepare: () => ({
            title: 'Single Image Mockup',
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
            name: 'mockupImage',
            title: 'Mockup Image',
            description:
                'The image to display. Try to use a 16:9 aspect ratio.',
            type: 'image',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'bottom',
            title: 'Bottom',
            description: 'Should the image be at the bottom of the container?',
            type: 'boolean',
            options: {
                layout: 'checkbox',
            },
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'fullWidth',
            title: 'Full Width',
            description: 'Should the colour fill the full width of the screen?',
            type: 'boolean',
            options: {
                layout: 'checkbox',
            },
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'tallImage',
            title: 'Tall Image',
            description: 'Enable this if the image is taller than it is wide.',
            type: 'boolean',
            options: {
                layout: 'checkbox',
            },
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'noPadding',
            title: 'No Padding',
            description: 'Remove padding from the container.',
            type: 'boolean',
            options: {
                layout: 'checkbox',
            },

            validation: (Rule) => Rule.required().error('Required'),
        }),
    ],
    initialValue: {
        bottom: false,
        fullWidth: false,
        noPadding: false,
        tallImage: false,
    },
})
