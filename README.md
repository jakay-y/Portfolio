# Justice Nweke — Portfolio

Personal portfolio site. React, TypeScript, Vite, Tailwind CSS, React Router, [motion](https://motion.dev).

## Development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env` and set `VITE_WEB3FORMS_KEY` (from [web3forms.com](https://web3forms.com)) to enable the contact form.

## Build

```bash
npm run build
```

Outputs to `dist/`.

## Deploy

Static site — deploys to Netlify (or any static host) from the `dist/` output. Build command: `npm run build`. Publish directory: `dist`.
