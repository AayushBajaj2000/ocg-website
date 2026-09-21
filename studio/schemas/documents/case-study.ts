// ./schemas/case-study.ts

import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
    name: 'caseStudy',
    type: 'document',
    title: 'Case Study',
    icon: () => '🎨',
    preview: {
        select: {
            title: 'project.title',
            media: 'project.image',
        },
    },
    fields: [
        defineField({
            name: 'project',
            title: 'Project',
            type: 'reference',
            // @ts-ignore
            to: [{ type: 'project' }],
            validation: (Rule) => Rule.required().error('Required'),
        }),
        defineField({
            name: 'pageBuilder',
            type: 'array',
            title: 'Page Builder',
            // @ts-ignore
            of: [
                defineArrayMember({
                    name: 'hero',
                    title: 'Hero',
                    type: 'hero',
                }),
                defineArrayMember({
                    name: 'summary',
                    title: 'Summary',
                    type: 'summary',
                }),
                defineArrayMember({
                    name: 'singleImageMockup',
                    title: 'Single Image Mockup',
                    type: 'singleImageMockup',
                }),
                defineArrayMember({
                    name: 'multiImageMockup',
                    title: 'Multiple Image Mockup',
                    type: 'multiImageMockup',
                }),
                defineArrayMember({
                    name: 'projectAndToolsUsed',
                    title: 'The Project and Tools Used',
                    type: 'projectAndToolsUsed',
                }),
                defineArrayMember({
                    name: 'caseStudyColour',
                    title: 'Colour',
                    type: 'caseStudyColour',
                }),
                defineField({
                    name: 'caseStudyFont',
                    title: 'Fonts',
                    type: 'reference',
                    to: [{ type: 'fonts' }],
                }),
                defineArrayMember({
                    name: 'solution',
                    title: 'Solution',
                    type: 'solution',
                }),
                defineArrayMember({
                    name: 'hasTestimonial',
                    title: 'Testimonial',
                    type: 'hasTestimonial',
                }),
            ],
        }),
    ],
})
