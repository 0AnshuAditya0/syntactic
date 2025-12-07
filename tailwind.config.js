/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			neon: {
  				cyan: '#00F5FF',
  				indigo: '#6366FF',
  				purple: '#8B5CF6'
  			},
  			dark: {
  				primary: '#0F0F12',
  				secondary: '#1A1B26',
  				elevated: '#1E1F2E'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-fira-code)',
  				'monospace'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			'grid-move': {
  				'0%': {
  					backgroundPosition: '0 0'
  				},
  				'100%': {
  					backgroundPosition: '50px 50px'
  				}
  			},
  			'glow-pulse': {
  				'0%, 100%': {
  					boxShadow: '0 0 20px rgba(99, 102, 255, 0.3), 0 0 40px rgba(99, 102, 255, 0.1)'
  				},
  				'50%': {
  					boxShadow: '0 0 30px rgba(99, 102, 255, 0.5), 0 0 60px rgba(99, 102, 255, 0.2)'
  				}
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'grid-move': 'grid-move 20s linear infinite',
  			'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
  			'float': 'float 3s ease-in-out infinite'
  		},
  		boxShadow: {
  			neon: '0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)',
  			'neon-lg': '0 0 20px rgba(0, 245, 255, 0.6), 0 0 40px rgba(0, 245, 255, 0.4)',
  			glow: '0 8px 24px rgba(99, 102, 255, 0.4), 0 4px 12px rgba(99, 102, 255, 0.3)',
  			elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 0 20px rgba(99, 102, 255, 0.15)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
