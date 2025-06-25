
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced Magical Harry Potter color palette
				magical: {
					gold: '#D4AF37',
					darkGold: '#B8860B',
					bronze: '#CD7F32',
					silver: '#C0C0C0',
					darkBlue: '#1A237E',
					mysticalPurple: '#4A148C',
					deepPurple: '#2E1065',
					emerald: '#50C878',
					crimson: '#DC143C',
					midnight: '#0F0F23',
					starlight: '#F8F8FF'
				}
			},
			fontFamily: {
				'magical': ['Cinzel', 'serif'],
				'enchanted': ['Playfair Display', 'serif'],
				'sans': ['Inter', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
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
						height: '0'
					}
				},
				'magical-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px #D4AF37, 0 0 10px #D4AF37, 0 0 15px #D4AF37',
						filter: 'brightness(1)'
					},
					'50%': {
						boxShadow: '0 0 10px #D4AF37, 0 0 20px #D4AF37, 0 0 30px #D4AF37, 0 0 40px #D4AF37',
						filter: 'brightness(1.2)'
					}
				},
				'sparkle': {
					'0%, 100%': {
						opacity: '0.3',
						transform: 'scale(0.8) rotate(0deg)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.2) rotate(180deg)'
					}
				},
				'levitate': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'33%': {
						transform: 'translateY(-8px) rotate(120deg)'
					},
					'66%': {
						transform: 'translateY(-4px) rotate(240deg)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'magical-entrance': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.3) rotate(-180deg)',
						filter: 'blur(4px)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'scale(1.1) rotate(0deg)',
						filter: 'blur(1px)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1) rotate(0deg)',
						filter: 'blur(0px)'
					}
				},
				'wand-wave': {
					'0%, 100%': {
						transform: 'rotate(-5deg) translateY(0px)'
					},
					'25%': {
						transform: 'rotate(5deg) translateY(-2px)'
					},
					'50%': {
						transform: 'rotate(-3deg) translateY(-4px)'
					},
					'75%': {
						transform: 'rotate(3deg) translateY(-2px)'
					}
				},
				'magical-pulse': {
					'0%, 100%': {
						transform: 'scale(1)',
						boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)'
					},
					'50%': {
						transform: 'scale(1.05)',
						boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'magical-glow': 'magical-glow 2s ease-in-out infinite',
				'sparkle': 'sparkle 1.5s ease-in-out infinite',
				'levitate': 'levitate 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'magical-entrance': 'magical-entrance 0.8s ease-out',
				'wand-wave': 'wand-wave 2s ease-in-out infinite',
				'magical-pulse': 'magical-pulse 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
