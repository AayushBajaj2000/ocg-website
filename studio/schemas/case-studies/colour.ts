import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
    name: 'colourBox',
    title: 'Colour Box',
    type: 'object',
    fields: [
        defineField({
            name: 'colourName',
            title: 'Colour Name',
            type: 'string',
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'cardColour',
            title: 'Card Colour',
            type: 'array',
            // @ts-ignore
            of: [
                defineArrayMember({
                    name: 'colors',
                    title: 'Colors',
                    type: 'color',
                    options: {
                        disableAlpha: true,
                    },
                }),
            ],
        }),
        defineField({
            name: 'textColour',
            title: 'Text Colour',
            type: 'color',
            validation: (Rule) => Rule.required().error('Required'),
            options: {
                disableAlpha: true,
            },
        }),
    ],
})
