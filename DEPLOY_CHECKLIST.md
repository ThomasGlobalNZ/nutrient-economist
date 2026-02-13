# SmartKete: Final Deployment Checklist 🚀

This list covers everything needed to take SmartKete from "Local MVP" to "Live World-Class App".

## 1. Version Control (GitHub)
- [ ] **Initialize Git:** Run `git init` in the project folder.
- [ ] **Create Repo:** Create a new repository on GitHub (e.g., `smartkete-app`).
- [ ] **Commit & Push:**
    ```bash
    git add .
    git commit -m "Initial commit: SmartKV MVP"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/smartkete-app.git
    git push -u origin main
    ```

## 2. CI/CD & Hosting (Vercel)
- [ ] **Sign up/Login:** Go to [Vercel.com](https://vercel.com).
- [ ] **Import Project:** Click "Add New > Project" and select your new GitHub repo.
- [ ] **Configure:**
    - Framework: Next.js (Auto-detected).
    - Build Command: `next build` (Default).
- [ ] **Deploy:** Click "Deploy". Vercel will build and assign a URL (e.g., `smartkete.vercel.app`).

## 3. Real AI Integration (Future)
Currently, the app uses `data/recipes.ts` (Mock Data). To make it real:
- [ ] **Get API Key:** Sign up for OpenAI (ChatGPT) or Google Gemini API.
- [ ] **Environment Variables:** Add `OPENAI_API_KEY` to Vercel Project Settings.
- [ ] **Backend Route:** Create `app/api/generate-recipe/route.ts` to call the API.
- [ ] **Frontend Update:** Update `ShoppingList.tsx` to call this API instead of `generateMockRecipes`.

## 4. Polish & Brand
- [ ] **Animations:** Add `framer-motion` for slick transitions (as requested).
- [ ] **Domain:** Purchase a domain (e.g., `smartkete.co.nz`) and connect it in Vercel.
- [ ] **Analytics:** Enable "Vercel Analytics" to track how many Kiwis are using it.

## 5. Maintenance
- [ ] **Update Prices:** The current snapshot is Feb 2026. You will need to update `mockData.ts` occasionally or build a scraper.

---
**Status:** Ready to Start Step 1 whenever you are!
