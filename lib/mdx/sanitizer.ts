import { defaultSchema } from 'hast-util-sanitize';

export const mdxSanitizationSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        div: [
            ...(defaultSchema.attributes?.div || []),
            ['className'],
        ],
        span: [
            ...(defaultSchema.attributes?.span || []),
            ['className'],
        ],
        code: [
            ...(defaultSchema.attributes?.code || []),
            ['className'],
        ],
        pre: [
            ...(defaultSchema.attributes?.pre || []),
            ['className'],
        ],
        CodePlaygroundEmbed: [
            'initialCode',
            'language',
            'readOnly',
        ],
        MermaidDiagram: [
            'chart',
        ],
    },
    tagNames: [
        ...(defaultSchema.tagNames || []),
        'CodePlaygroundEmbed',
        'MermaidDiagram',
        'Callout',
    ],
};
