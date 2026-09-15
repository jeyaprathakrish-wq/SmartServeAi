import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#172033', brand: '#2563eb', mint: '#16a34a' } } }, plugins: [] } satisfies Config;
