# Revector

Revector is a developer tool for turning raw SVG markup into smaller, reusable React or Vue components.

It runs SVG input through SVGO, converts the result into framework-specific component code, and formats the generated output with Prettier. React output can be generated as JavaScript, TypeScript, or JSX-only markup.

## Features

- Multipass SVG optimisation with SVGO
- React and Vue component generation
- Optional TypeScript output for React components
- JSX-only output when a full component wrapper is not needed
- Responsive `1em` width and height applied to generated SVGs
- Prettier-formatted component output
- Server-side input validation with Zod

## Tech Stack

- React 19
- TypeScript
- TanStack Start / TanStack Router
- SVGO
- Prettier
- Zod
- Tailwind CSS
- Vitest
- Biome

## How It Works

The optimisation pipeline lives in `src/features/optimize/optimize-svg.ts`:

1. Validate the submitted SVG and output options with Zod
2. Optimise the SVG using SVGO with multipass enabled
3. Generate React or Vue component code
4. Format the generated code with Prettier
5. Return both the optimised SVG and component source

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

Run linting and formatting checks:

```bash
pnpm check
```
