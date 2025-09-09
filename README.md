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

## Installation Notes

When installing dependencies, use the `--legacy-peer-deps` flag to handle dependency conflicts:

```bash
npm install --legacy-peer-deps
```

This is necessary due to a conflict between the `dotenv` package versions required by different dependencies. The project needs:

- `dotenv@16.4.5` for `@browserbasehq/stagehand` (used by `@langchain/community`)
- But newer packages might require `dotenv@17.x`

The build script and deployment configurations handle this automatically.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on Render

This project is configured for deployment on [Render](https://render.com). Follow these steps for successful deployment:

1. **Fork or clone this repository to your GitHub account**

2. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the "Node" environment
   - The build command will be automatically set based on the `render.yaml` configuration
   - The start command will be automatically set to `npm start`

3. **Set up Environment Variables**
   - In the Render dashboard, add all required environment variables as specified in the `.env.example` file
   - Critical variables include:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - `DATABASE_URL`
     - `UPLOADTHING_TOKEN`
     - `GEMINI_API_KEY`

4. **Deploy**
   - Click "Create Web Service" and Render will handle the rest
   - The deployment uses a custom `build.sh` script that handles dependency conflicts with the `--legacy-peer-deps` flag

5. **Troubleshooting Common Issues**
   - If you encounter dependency conflicts, the `--legacy-peer-deps` flag in `build.sh` should resolve most issues
   - For database connection issues, verify your `DATABASE_URL` format and credentials
   - For more help, check the Render logs in the dashboard
