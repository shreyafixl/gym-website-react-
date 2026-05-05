# 👨‍💻 Developer Quick Reference Guide

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## 🧩 Component Patterns

### Using Theme Context

```javascript
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Using Scroll Animations

```javascript
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AnimatedComponent() {
  const [ref, isVisible] = useScrollAnimation({ 
    once: true,      // Animate only once
    threshold: 0.2   // Trigger when 20% visible
  });
  
  return (
    <div ref={ref} className={isVisible ? 'fade-in-up' : ''}>
      Content animates when scrolled into view
    </div>
  );
}
```

### Using Debounced Search

```javascript
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  // Use debouncedSearch for filtering
  // It only updates 300ms after user stops typing
  
  return (
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Using Modal

```javascript
import { useState } from 'react';
import Modal from '../components/Modal';

function ComponentWithModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Modal Title"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Using Favorites

```javascript
import { useFavorites } from '../hooks/useFavorites';

function FavoriteButton({ item }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  return (
    <button onClick={() => toggleFavorite(item)}>
      {isFavorite(item.id) ? '❤️' : '🤍'}
    </button>
  );
}
```

### Using Reducer for Filters

```javascript
import { useReducer } from 'react';
import { filterReducer, filterInitialState } from '../reducers/filterReducer';

function FilteredList() {
  const [state, dispatch] = useReducer(filterReducer, filterInitialState);
  
  return (
    <div>
      <input 
        value={state.searchQuery}
        onChange={(e) => dispatch({ 
          type: 'SET_SEARCH', 
          payload: e.target.value 
        })}
      />
      
      <select 
        value={state.selectedCategory}
        onChange={(e) => dispatch({ 
          type: 'SET_CATEGORY', 
          payload: e.target.value 
        })}
      >
        <option value="All">All</option>
      </select>
      
      <button onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
        Reset
      </button>
    </div>
  );
}
```

---

## 🎨 Styling Patterns

### Using CSS Variables

```css
/* Access theme variables */
.my-component {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.my-button {
  background-color: var(--accent);
}

.my-button:hover {
  background-color: var(--accent-hover);
}
```

### Animation Classes

```css
/* Fade in up animation */
.fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}

/* Apply to elements that should animate on scroll */
<div className={isVisible ? 'fade-in-up' : ''}>
  Content
</div>
```

---

## 🚀 Performance Tips

### 1. Memoize Expensive Computations

```javascript
import { useMemo } from 'react';

const filteredData = useMemo(() => {
  return data.filter(item => /* expensive filter */);
}, [data, filterCriteria]);
```

### 2. Memoize Components

```javascript
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{/* render logic */}</div>;
});
```

### 3. Memoize Callbacks

```javascript
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

### 4. Lazy Load Routes

```javascript
import { lazy, Suspense } from 'react';

const MyPage = lazy(() => import('./pages/MyPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MyPage />
    </Suspense>
  );
}
```

---

## 🔧 Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`
2. Add lazy import in `App.js`:
```javascript
const NewPage = lazy(() => import("./pages/NewPage"));
```
3. Add route:
```javascript
<Route path="/new-page" element={<NewPage />} />
```
4. Add navigation link in `Navbar.js`

### Adding a New Filter

1. Add action to `filterReducer.js`:
```javascript
case 'SET_NEW_FILTER':
  return { ...state, newFilter: action.payload };
```
2. Add to initial state
3. Use in component:
```javascript
dispatch({ type: 'SET_NEW_FILTER', payload: value });
```

### Creating a Custom Hook

```javascript
// src/hooks/useMyHook.js
import { useState, useEffect } from 'react';

export function useMyHook(initialValue) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [value]);
  
  return [value, setValue];
}
```

### Adding Animation to Component

1. Import hook:
```javascript
import { useScrollAnimation } from '../hooks/useScrollAnimation';
```

2. Use in component:
```javascript
const [ref, isVisible] = useScrollAnimation({ once: true });
```

3. Apply to element:
```javascript
<div ref={ref} className={isVisible ? 'fade-in-up' : ''}>
  Content
</div>
```

---

## 🐛 Debugging Tips

### Check Theme State
```javascript
// In any component
const { theme } = useTheme();
console.log('Current theme:', theme);
```

### Check Filter State
```javascript
// In filtered components
console.log('Filter state:', state);
console.log('Filtered results:', filteredData);
```

### Check Render Count
```javascript
import { useEffect, useRef } from 'react';

function MyComponent() {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log('Render count:', renderCount.current);
  });
  
  return <div>Component</div>;
}
```

### Check Memoization
```javascript
// Add console.log in useMemo
const result = useMemo(() => {
  console.log('Computing expensive value');
  return expensiveComputation();
}, [deps]);
```

---

## 📦 Project Structure

```
gym-website/
├── public/                 # Static files
├── src/
│   ├── components/        # Reusable components
│   │   ├── ErrorBoundary.js
│   │   ├── Modal.js
│   │   ├── ThemeToggle.js
│   │   ├── ScrollToTop.js
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.js
│   ├── hooks/             # Custom hooks
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   ├── useScrollAnimation.js
│   │   ├── useFavorites.js
│   │   └── useScrollToTop.js
│   ├── pages/             # Page components
│   │   └── ...
│   ├── reducers/          # State reducers
│   │   └── filterReducer.js
│   ├── data/              # Static data
│   │   └── ...
│   ├── App.js             # Main app component
│   ├── App.css            # Global styles
│   └── index.js           # Entry point
├── ADVANCED_FEATURES.md   # Feature documentation
├── UPGRADE_SUMMARY.md     # Upgrade overview
├── DEVELOPER_GUIDE.md     # This file
└── package.json
```

---

## 🔍 Code Review Checklist

Before committing:
- [ ] Components are memoized where appropriate
- [ ] Expensive computations use useMemo
- [ ] Event handlers use useCallback
- [ ] New pages are lazy-loaded
- [ ] Accessibility attributes added (ARIA)
- [ ] Error boundaries wrap risky code
- [ ] Loading states implemented
- [ ] Responsive design tested
- [ ] Theme works in both modes
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)

---

## 🎓 Learning Resources

### React Hooks
- [React Hooks Documentation](https://react.dev/reference/react)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)

### Performance
- [React Performance](https://react.dev/learn/render-and-commit)
- [useMemo vs useCallback](https://react.dev/reference/react/useMemo)

### Advanced Patterns
- [Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Portals](https://react.dev/reference/react-dom/createPortal)

---

## 💡 Best Practices

1. **Always memoize** expensive computations and callbacks passed to child components
2. **Use lazy loading** for routes and heavy components
3. **Implement error boundaries** around risky operations
4. **Debounce user input** to reduce re-renders
5. **Use semantic HTML** and ARIA attributes
6. **Test in both themes** before deploying
7. **Keep components small** and focused
8. **Extract reusable logic** into custom hooks
9. **Use TypeScript** for better type safety (future enhancement)
10. **Document complex logic** with comments

---

## 🆘 Troubleshooting

### Theme not persisting
- Check localStorage in DevTools
- Verify ThemeProvider wraps entire app

### Animations not working
- Check if element has ref attached
- Verify CSS animation classes exist
- Check browser support for Intersection Observer

### Modal not closing
- Verify onClose prop is passed
- Check if ESC key handler is working
- Ensure overlay click handler is present

### Filters not working
- Check reducer actions are dispatched correctly
- Verify filter logic in useMemo
- Console.log state to debug

### Build failing
- Run `npm install` to ensure dependencies
- Check for syntax errors
- Verify all imports are correct
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

---

**Happy Coding! 🚀**
