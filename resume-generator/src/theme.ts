import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Configure color mode
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Extend the theme with custom colors, fonts, etc.
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#bae3ff',
      200: '#8ed0ff',
      300: '#61bdff',
      400: '#34aaff',
      500: '#1a91e6', // Primary brand color
      600: '#0071cc',
      700: '#0052a3',
      800: '#00357a',
      900: '#001952',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Button: {
      // Custom button variants can be defined here
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
  },
})

export default theme
