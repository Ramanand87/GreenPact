/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		scrollbar: {
			thin: "thin",
			thumb: {
			  green: {
				300: "#86efac",
				400: "#4ade80",
			  },
			},
			track: {
			  green: {
				50: "#f0fdf4",
			  },
			},
		  },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
			  primary: {
				DEFAULT: "hsl(130, 40%, 30%)", // Forest green
				foreground: "hsl(0, 0%, 98%)",
			  },
			  secondary: {
				DEFAULT: "hsl(35, 60%, 50%)", // Wheat/harvest gold
				foreground: "hsl(0, 0%, 9%)",
			  },
  			destructive: {
				DEFAULT: "hsl(0, 65%, 45%)",
				foreground: "hsl(0, 0%, 98%)",
			  },
			  muted: {
				DEFAULT: "hsl(60, 10%, 96%)",
				foreground: "hsl(25, 30%, 30%)", // Brown/soil
			  },
			  accent: {
				DEFAULT: "hsl(65, 65%, 65%)", // Light grass/hay
				foreground: "hsl(25, 30%, 30%)",
			  },
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwind-scrollbar"),require("tailwindcss-animate")],
};
