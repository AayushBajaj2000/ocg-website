import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'caseStudyColour',
    title: 'Case Study Colour',
    type: 'object',
    icon: () => '🎨',
    preview: {
        prepare: () => ({
            title: 'Case Study Colour',
            subtitle: 'Click to edit',
        }),
    },
    fields: [
        // defineField({
        //     name: 'font',
        //     title: 'Font',
        //     type: 'font',
        //     validation: (Rule) => Rule.required().error('Required'),
        //     // @ts-ignore
        //     // to: [{ type: 'fonts' }],
        // }),
        defineField({
            name: 'colourBoxes',
            title: 'Colour Boxes',
            type: 'array',
            // @ts-ignore
            of: [{ type: 'colourBox' }],
            validation: (Rule) => Rule.required().error('Required'),
        }),
    ],
})

/* 
ThreadBreak

Sky Blue
#1da1f2
#ffffff

Dark Grey
#121212
#ffffff

Cotton White
#f9fafb
#101828

font: Switzer
*/
