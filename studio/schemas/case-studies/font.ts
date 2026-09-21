import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'font',
    title: 'Font',
    type: 'object',
    fields: [
        defineField({
            name: 'fontName',
            title: 'Font Name',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'fontImage',
            title: 'Font Image',
            type: 'image',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'fontWeightImages',
            title: 'Font Weight Images',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'fontWeightImage',
                            title: 'Font Weight Image',
                            type: 'image',
                            validation: (Rule) =>
                                Rule.required().error('Required'),
                        }),
                        defineField({
                            name: 'shiftDown',
                            title: 'Shift Down',
                            type: 'boolean',
                            options: {
                                layout: 'checkbox',
                            },

                            validation: (Rule) =>
                                Rule.required().error('Required'),
                        }),
                    ],
                },
            ],
            validation: (Rule) => Rule.required().error('Required'),
        }),
    ],
})
