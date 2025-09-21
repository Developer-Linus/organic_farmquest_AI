import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

// Custom color tokens to match Tailwind configuration
const customTokens = {
  color: {
    // Primary Brand Colors - Earth & Growth Palette
    'primary-50': '#f0f9f0',
    'primary-100': '#dcf2dc',
    'primary-200': '#b9e5b9',
    'primary-300': '#90d490',
    'primary-400': '#66c266',
    'primary-500': '#4a7c59',
    'primary-600': '#2d5016',
    'primary-700': '#1f3a0f',
    'primary-800': '#152a0b',
    'primary-900': '#0d1c06',
    
    // Secondary Colors - Natural Earth Tones
    'earth-50': '#faf8f5',
    'earth-100': '#f5f1ea',
    'earth-200': '#ede5d3',
    'earth-300': '#e0d0b3',
    'earth-400': '#d1b88a',
    'earth-500': '#c19a5c',
    'earth-600': '#8b4513',
    'earth-700': '#6b3410',
    'earth-800': '#4a240b',
    'earth-900': '#2d1607',
    
    // Accent Colors - Vibrant Nature
    'accent-50': '#fffef0',
    'accent-100': '#fffadc',
    'accent-200': '#fff3b8',
    'accent-300': '#ffe985',
    'accent-400': '#ffdc52',
    'accent-500': '#ffd700',
    'accent-600': '#e6c200',
    'accent-700': '#b8a000',
    'accent-800': '#8a7800',
    'accent-900': '#5c5000',
    
    // Orange Colors - Warning & Development
    'orange-50': '#fff7ed',
    'orange-100': '#ffedd5',
    'orange-200': '#fed7aa',
    'orange-300': '#fdba74',
    'orange-400': '#fb923c',
    'orange-500': '#f97316',
    'orange-600': '#ea580c',
    'orange-700': '#c2410c',
    'orange-800': '#9a3412',
    'orange-900': '#7c2d12',
  }
}

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    ...customTokens,
  },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}