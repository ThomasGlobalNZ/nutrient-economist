# Deploying to GitHub Pages

You have configured the project for **GitHub Pages**. Follow these steps to deploy your app live.

## 1. Prerequisites
You need to install the `gh-pages` tool to handle the deployment.
Run this command in your terminal:

```bash
npm install -D gh-pages
```

## 2. Initialize & Push to GitHub
If you haven't pushed your code to your repository yet (`https://github.com/ThomasGlobalNZ/nutrient-economist`), do this:

```bash
git init
git add .
git commit -m "Initial commit with AI features"
git branch -M main
git remote add origin https://github.com/ThomasGlobalNZ/nutrient-economist.git
git push -u origin main
```

## 3. Deploy
Once installed and pushed, you can deploy anytime with a single command:

```bash
npm run deploy
```

**What this does:**
1.  Builds your app (converts to static HTML/CSS/JS in `out/` folder).
2.  Pushes the `out/` folder to a `gh-pages` branch on your GitHub repository.

## 4. Enable GitHub Pages
1.  Go to your repository settings: [https://github.com/ThomasGlobalNZ/nutrient-economist/settings/pages](https://github.com/ThomasGlobalNZ/nutrient-economist/settings/pages)
2.  Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3.  Under **Branch**, select `gh-pages` and save.
4.  Your site will be live at: **https://ThomasGlobalNZ.github.io/nutrient-economist/**

---

## Troubleshooting
-   **Images not loading?** Ensure `next.config.ts` has `basePath: '/nutrient-economist'`.
-   **404 on refresh?** GitHub Pages is a static host. If you add multiple pages later, you might need a special 404 handler, but for this single-page app, it works out of the box.
