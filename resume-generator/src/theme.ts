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
      50: '#e6f2ff',
      100: '#c9deff',
      200: '#a7c9ff',
      300: '#84b3ff',
      400: '#619dff',
      500: '#3e87ff', // Primary brand color
      600: '#2c68dd',
      700: '#1e4bba',
      800: '#113297',
      900: '#061b74',
    },
    // Additional color palette for a premium look
    premium: {
      50: '#f0e5ff',
      100: '#d4bbff',
      200: '#b890ff',
      300: '#9c65ff',
      400: '#813aff',
      500: '#6510ff', // Premium accent color
      600: '#5208cf',
      700: '#3c04a0',
      800: '#270170',
      900: '#150041',
    }
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: { colorScheme?: string }) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
          _active: {
            bg: props.colorScheme === 'brand' ? 'brand.700' : undefined,
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        }),
        outline: (props: { colorScheme?: string }) => ({
          borderColor: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.50' : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
          transition: 'all 0.2s',
        }),
        ghost: (props: { colorScheme?: string }) => ({
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.50' : undefined,
          },
          transition: 'all 0.2s',
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
        },
      },
      variants: {
        outline: {
          container: {
            boxShadow: 'sm',
            transition: 'all 0.3s',
          },
        },
        filled: {
          container: {
            boxShadow: 'md',
          },
        },
        premium: {
          container: {
            bgGradient: 'linear(to-br, brand.500, premium.500)',
            color: 'white',
            boxShadow: 'lg',
          }
        }
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
        }
      },
      variants: {
        filled: {
          field: {
            _focus: {
              borderColor: 'brand.500',
            }
          }
        },
        outline: {
          field: {
            _focus: {
              borderColor: 'brand.500',
              boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
            }
          }
        }
      }
    },
    Tabs: {
      variants: {
        'soft-rounded': {
          tab: {
            fontWeight: 'medium',
            _selected: {
              color: 'brand.500',
              bg: 'brand.50',
            },
          }
        }
      }
    }
  },
})

export default theme
