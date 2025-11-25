# Multilingual Feature - Hindi & English

## Overview
Your website now supports both **English** and **Hindi** languages using `next-intl` library. Users can switch between languages using the globe icon in the navbar.

## 🚀 Key Features

- **Seamless Language Switching**: Globe icon in navbar allows instant language switch
- **URL-based Routing**: Language is reflected in URL (e.g., `/en/market`, `/hi/market`)
- **Persistent Selection**: User's language preference is maintained across navigation
- **Beautiful UI**: Smooth animations and clean dropdown design

## 📁 File Structure

```
frontend/
├── middleware.js                    # Handles locale routing
├── i18n.js                         # i18n configuration
├── messages/
│   ├── en.json                    # English translations
│   └── hi.json                    # Hindi translations
├── app/
│   ├── layout.js                  # Root layout (minimal)
│   ├── page.js                    # Redirects to /en
│   └── [locale]/
│       ├── layout.js              # Locale-specific layout with i18n provider
│       └── page.js                # Home page
└── components/
    └── Navbar/
        └── LanguageSwitcher.jsx   # Language switcher component
```

## 🎯 How to Add Translations

### 1. Add New Translation Keys

Edit `messages/en.json` and `messages/hi.json`:

**English (en.json)**:
```json
{
  "nav": {
    "home": "Home",
    "market": "Market"
  },
  "common": {
    "welcome": "Welcome"
  }
}
```

**Hindi (hi.json)**:
```json
{
  "nav": {
    "home": "होम",
    "market": "बाज़ार"
  },
  "common": {
    "welcome": "स्वागत है"
  }
}
```

### 2. Use Translations in Components

```jsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('nav');
  
  return (
    <div>
      <h1>{t('home')}</h1>
      <p>{t('market')}</p>
    </div>
  );
}
```

### 3. Handle Dynamic Routes with Locale

When creating links, always include the locale:

```jsx
'use client';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function MyComponent() {
  const locale = useLocale();
  
  return (
    <Link href={`/${locale}/market`}>
      Go to Market
    </Link>
  );
}
```

## 🔧 Component Usage

### Language Switcher

The language switcher is already integrated in the navbar:

```jsx
import { LanguageSwitcher } from './LanguageSwitcher';

// In your component
<LanguageSwitcher />
```

### Available Hooks

```jsx
import { useTranslations, useLocale } from 'next-intl';

// Get translations
const t = useTranslations('nav'); // 'nav', 'common', 'footer' etc.

// Get current locale
const locale = useLocale(); // 'en' or 'hi'
```

## 📝 Translation Namespaces

Currently available namespaces:

1. **nav**: Navigation items (Home, Market, Demands, etc.)
2. **common**: Common UI elements (buttons, messages, etc.)
3. **footer**: Footer content

## 🌐 Adding More Pages

When creating new pages, place them inside `app/[locale]/` directory:

```
app/
└── [locale]/
    ├── about/
    │   └── page.js
    ├── contact/
    │   └── page.js
    └── market/
        └── page.js
```

## 🎨 Language Switcher Design

The language switcher features:
- Globe icon with country flag indicator
- Smooth dropdown animation
- Current language highlighted with checkmark
- Responsive design for mobile and desktop

## 🔄 Migration Guide

To migrate existing pages to support i18n:

1. **Move page from** `app/page-name/` **to** `app/[locale]/page-name/`
2. **Update all internal links** to include `/${locale}` prefix
3. **Add translations** to `messages/en.json` and `messages/hi.json`
4. **Use** `useTranslations()` hook for text content

Example:
```jsx
// Before
<Link href="/market">Market</Link>

// After
const locale = useLocale();
<Link href={`/${locale}/market`}>Market</Link>
```

## 🚀 Testing

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000` (auto-redirects to `/en`)
3. Click the globe icon in navbar
4. Select हिन्दी to switch to Hindi
5. Notice URL changes to `/hi/...`
6. Navigation items should display in Hindi

## 📚 Adding New Languages

To add more languages (e.g., Marathi):

1. Update `middleware.js`:
```js
locales: ['en', 'hi', 'mr']
```

2. Create `messages/mr.json`

3. Update `LanguageSwitcher.jsx`:
```js
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
];
```

## 🐛 Troubleshooting

**Issue**: Language not switching
- Check if URL includes locale prefix (`/en/` or `/hi/`)
- Verify middleware.js is in the root of frontend folder

**Issue**: Translations not showing
- Ensure JSON files are properly formatted
- Check translation key names match exactly
- Verify `useTranslations('namespace')` uses correct namespace

**Issue**: 404 errors
- All routes must be inside `app/[locale]/` directory
- Update internal links to include locale

## 📖 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js App Router i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

---

**Note**: The navbar and language switcher are fully functional. You can now add translations for other components as needed!
