This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
harvest-hub
├─ components.json
├─ eslint.config.mjs
├─ next-auth.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ register
│  │  │     └─ page.tsx
│  │  ├─ actions
│  │  │  ├─ customer-actions
│  │  │  │  └─ actions.ts
│  │  │  └─ farmer-actions
│  │  │     └─ actions.ts
│  │  ├─ api
│  │  │  └─ auth
│  │  │     ├─ register
│  │  │     │  └─ route.ts
│  │  │     └─ [...nextauth]
│  │  │        └─ route.ts
│  │  ├─ context
│  │  │  └─ AuthProvider.tsx
│  │  ├─ customer
│  │  │  ├─ dashboard
│  │  │  │  ├─ CustomerDashboard.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ marketplace
│  │  │  │  ├─ MarketPlace.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ products
│  │  │  │     └─ [id]
│  │  │  │        ├─ page.tsx
│  │  │  │        └─ ProductInfo.tsx
│  │  │  └─ profile
│  │  │     ├─ CustomerProfile.tsx
│  │  │     └─ page.tsx
│  │  ├─ denied
│  │  │  └─ page.tsx
│  │  ├─ farmer
│  │  │  ├─ add-product
│  │  │  │  ├─ AddProduct.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ dashboard
│  │  │  │  ├─ ClientDashboard.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ manage-inventory
│  │  │  │  ├─ ManageInventory.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ orders
│  │  │  │  ├─ Orders.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ profile
│  │  │     ├─ FarmerProfile.tsx
│  │  │     └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ footer.tsx
│  │  ├─ ImagePicker.tsx
│  │  ├─ navbar.tsx
│  │  ├─ OrderModal.tsx
│  │  ├─ searchbar.tsx
│  │  └─ ui
│  │     ├─ alert.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sonner.tsx
│  │     ├─ table.tsx
│  │     └─ textarea.tsx
│  ├─ hooks
│  │  └─ use-auth.ts
│  ├─ lib
│  │  ├─ auth.ts
│  │  ├─ cloudinary.ts
│  │  ├─ prisma.ts
│  │  ├─ utils.ts
│  │  └─ validation.ts
│  ├─ middleware.ts
│  └─ prisma
│     ├─ generated
│     │  └─ prisma
│     │     ├─ client.d.ts
│     │     ├─ client.js
│     │     ├─ default.d.ts
│     │     ├─ default.js
│     │     ├─ edge.d.ts
│     │     ├─ edge.js
│     │     ├─ index-browser.js
│     │     ├─ index.d.ts
│     │     ├─ index.js
│     │     ├─ package.json
│     │     ├─ query_engine-windows.dll.node
│     │     ├─ runtime
│     │     │  ├─ edge-esm.js
│     │     │  ├─ edge.js
│     │     │  ├─ index-browser.d.ts
│     │     │  ├─ index-browser.js
│     │     │  ├─ library.d.ts
│     │     │  ├─ library.js
│     │     │  ├─ react-native.js
│     │     │  ├─ wasm-compiler-edge.js
│     │     │  └─ wasm-engine-edge.js
│     │     ├─ schema.prisma
│     │     ├─ wasm.d.ts
│     │     └─ wasm.js
│     ├─ migrations
│     │  ├─ 20250826084457_new_migarte
│     │  │  └─ migration.sql
│     │  └─ migration_lock.toml
│     └─ schema.prisma
├─ tailwind.config.js
└─ tsconfig.json

```