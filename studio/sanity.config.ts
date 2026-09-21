import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { colorInput } from '@sanity/color-input'
import { codeInput } from '@sanity/code-input'
import { OpenCoreLogo } from './components/logo'
import { openCoreTheme } from './theme'

export default defineConfig({
    name: 'default',
    title: 'OpenCore Group',
    icon: OpenCoreLogo,
    theme: openCoreTheme,
    projectId: '4x3yyhbh',
    dataset: 'production',
    plugins: [structureTool(), visionTool(), colorInput(), codeInput()],

    schema: {
        types: schemaTypes,
    },
})
