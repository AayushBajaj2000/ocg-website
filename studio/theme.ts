import { buildLegacyTheme } from 'sanity'

// Brand colours from the website's tailwind.config.ts
const navy = '#294F74'
const navyDark = '#10202E'
const white = '#FFFFFF'

export const openCoreTheme = buildLegacyTheme({
    '--black': navyDark,
    '--white': white,
    '--gray': '#667085',
    '--gray-base': '#667085',

    '--component-bg': white,
    '--component-text-color': navyDark,

    '--brand-primary': navy,
    '--default-button-color': '#667085',
    '--default-button-primary-color': navy,
    '--focus-color': navy,

    '--main-navigation-color': navyDark,
    '--main-navigation-color--inverted': white,
})
