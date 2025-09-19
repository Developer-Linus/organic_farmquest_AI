/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Earth & Growth Palette
        primary: {
          50: '#f0f9f0',   // Very light green tint
          100: '#dcf2dc',  // Light green
          200: '#b9e5b9',  // Soft green
          300: '#90d490',  // Medium green
          400: '#66c266',  // Bright green
          500: '#4a7c59',  // Main brand green (sage)
          600: '#2d5016',  // Deep forest green
          700: '#1f3a0f',  // Darker forest
          800: '#152a0b',  // Very dark green
          900: '#0d1c06',  // Almost black green
        },
        
        // Secondary Colors - Natural Earth Tones
        earth: {
          50: '#faf8f5',   // Cream white
          100: '#f5f1ea',  // Light cream
          200: '#ede5d3',  // Beige
          300: '#e0d0b3',  // Light brown
          400: '#d1b88a',  // Medium brown
          500: '#c19a5c',  // Warm brown
          600: '#8b4513',  // Saddle brown
          700: '#6b3410',  // Dark brown
          800: '#4a240b',  // Very dark brown
          900: '#2d1607',  // Almost black brown
        },
        
        // Accent Colors - Vibrant Nature
        accent: {
          50: '#fffef0',   // Light yellow tint
          100: '#fffadc',  // Cream yellow
          200: '#fff3b8',  // Light gold
          300: '#ffe985',  // Medium gold
          400: '#ffdc52',  // Bright gold
          500: '#ffd700',  // Golden yellow
          600: '#e6c200',  // Darker gold
          700: '#b8a000',  // Deep gold
          800: '#8a7800',  // Dark gold
          900: '#5c5000',  // Very dark gold
        },
        
        // Semantic Colors for Stories & Gameplay
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Success green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Warning amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Error red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Story Reading Colors - Eye-friendly
        story: {
          bg: '#fefefe',      // Pure white background
          'bg-dark': '#1a1a1a', // Dark mode background
          text: '#2d3748',    // Dark gray for readability
          'text-light': '#4a5568', // Lighter text for secondary content
          'text-dark': '#e2e8f0', // Light text for dark mode
          paper: '#fffef7',   // Warm paper-like background
          'paper-dark': '#2d2d2d', // Dark paper background
        },
        
        // Interactive Elements
        interactive: {
          hover: '#f7fafc',   // Light hover state
          'hover-dark': '#374151', // Dark hover state
          pressed: '#edf2f7', // Pressed state
          'pressed-dark': '#4b5563', // Dark pressed state
          focus: '#bee3f8',   // Focus ring color
        },
      },
      
      fontFamily: {
        // Primary font stack for headings
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        // Body text font stack
        'body': ['Source Sans Pro', 'system-ui', 'sans-serif'],
        // Accent font for playful elements
        'accent': ['Nunito', 'system-ui', 'sans-serif'],
        // Monospace for code or technical content
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        // Story reading optimized sizes
        'story-xs': ['12px', { lineHeight: '18px', letterSpacing: '0.025em' }],
        'story-sm': ['14px', { lineHeight: '21px', letterSpacing: '0.025em' }],
        'story-base': ['16px', { lineHeight: '26px', letterSpacing: '0.015em' }],
        'story-lg': ['18px', { lineHeight: '30px', letterSpacing: '0.015em' }],
        'story-xl': ['20px', { lineHeight: '32px', letterSpacing: '0.01em' }],
        'story-2xl': ['24px', { lineHeight: '38px', letterSpacing: '0.01em' }],
        
        // Game UI sizes
        'ui-xs': ['11px', { lineHeight: '16px' }],
        'ui-sm': ['13px', { lineHeight: '18px' }],
        'ui-base': ['15px', { lineHeight: '22px' }],
        'ui-lg': ['17px', { lineHeight: '24px' }],
        'ui-xl': ['19px', { lineHeight: '28px' }],
      },
      
      spacing: {
        // Story content spacing
        'story': '1.5rem',    // 24px
        'story-sm': '1rem',   // 16px
        'story-lg': '2rem',   // 32px
        'story-xl': '3rem',   // 48px
        
        // Game UI spacing
        'game': '1rem',       // 16px
        'game-sm': '0.75rem', // 12px
        'game-lg': '1.25rem', // 20px
        'game-xl': '2rem',    // 32px
      },
      
      borderRadius: {
        // Organic, nature-inspired border radius
        'organic': '12px',
        'organic-sm': '8px',
        'organic-lg': '16px',
        'organic-xl': '24px',
        
        // Story card radius
        'story': '16px',
        'story-sm': '12px',
        'story-lg': '20px',
      },
      
      boxShadow: {
        // Soft, natural shadows
        'organic': '0 4px 20px rgba(45, 80, 22, 0.1)',
        'organic-lg': '0 8px 30px rgba(45, 80, 22, 0.15)',
        'organic-xl': '0 12px 40px rgba(45, 80, 22, 0.2)',
        
        // Story card shadows
        'story': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'story-hover': '0 4px 20px rgba(0, 0, 0, 0.12)',
        
        // Interactive shadows
        'button': '0 2px 8px rgba(74, 124, 89, 0.2)',
        'button-hover': '0 4px 12px rgba(74, 124, 89, 0.3)',
      },
      
      animation: {
        // Gentle, nature-inspired animations
        'grow': 'grow 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      
      keyframes: {
        grow: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      backdropBlur: {
        'organic': '12px',
      },
      
      // Custom gradients for backgrounds
      backgroundImage: {
        'gradient-organic': 'linear-gradient(135deg, #f0f9f0 0%, #dcf2dc 100%)',
        'gradient-earth': 'linear-gradient(135deg, #faf8f5 0%, #ede5d3 100%)',
        'gradient-story': 'linear-gradient(180deg, #fffef7 0%, #fefefe 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      },
    },
  },
  plugins: [],
}

