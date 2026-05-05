# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Application Layer                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                        App.js                             │  │
│  │  - Error Boundary Wrapper                                 │  │
│  │  - Theme Provider                                         │  │
│  │  - Router Configuration                                   │  │
│  │  - Lazy Loading Setup                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌──────────────────┐    ┌──────────────┐
│   Context     │    │   Components     │    │    Pages     │
│   Layer       │    │   Layer          │    │   Layer      │
├───────────────┤    ├──────────────────┤    ├──────────────┤
│               │    │                  │    │              │
│ ThemeContext  │───▶│ Navbar           │    │ Home         │
│               │    │ Hero             │    │ Classes      │
│               │    │ Classes          │    │ Trainers     │
│               │    │ Modal            │    │ Pricing      │
│               │    │ ThemeToggle      │    │ ...          │
│               │    │ ScrollToTop      │    │              │
│               │    │ ErrorBoundary    │    │              │
└───────────────┘    └──────────────────┘    └──────────────┘
        │                      │                      │
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │   Custom Hooks     │
                    │   Layer            │
                    ├────────────────────┤
                    │                    │
                    │ useLocalStorage    │
                    │ useDebounce        │
                    │ useScrollAnimation │
                    │ useFavorites       │
                    │ useScrollToTop     │
                    │                    │
                    └────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │   State Management │
                    ├────────────────────┤
                    │                    │
                    │ filterReducer      │
                    │ useState           │
                    │ useReducer         │
                    │                    │
                    └────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │   Data Layer       │
                    ├────────────────────┤
                    │                    │
                    │ classesData        │
                    │ trainersData       │
                    │ pricingData        │
                    │ ...                │
                    │                    │
                    └────────────────────┘
```

---

## Component Hierarchy

```
App (ErrorBoundary + ThemeProvider)
│
├── Navbar
│   ├── ThemeToggle
│   └── Navigation Links
│
├── Routes (Lazy Loaded)
│   │
│   ├── Home
│   │   ├── Hero (with scroll animations)
│   │   ├── Benefits
│   │   ├── Classes (preview)
│   │   ├── Facilities (preview)
│   │   ├── Pricing (preview)
│   │   ├── Testimonials (preview)
│   │   └── Gallery (preview)
│   │
│   ├── ClassesPage
│   │   └── Classes (full with filters)
│   │       ├── Filter Controls
│   │       ├── ClassCard (memoized)
│   │       └── Modal (portal)
│   │
│   ├── TrainersPage
│   │   ├── Filter Controls
│   │   └── TrainerCard (memoized)
│   │
│   └── ... (other pages)
│
├── Footer
│
└── ScrollToTop
```

---

## Data Flow

### Theme Management
```
User clicks ThemeToggle
        │
        ▼
toggleTheme() called
        │
        ▼
ThemeContext updates
        │
        ▼
localStorage saves preference
        │
        ▼
CSS variables update
        │
        ▼
All components re-render with new theme
```

### Filter Flow (Classes/Trainers)
```
User types in search
        │
        ▼
useState updates searchQuery
        │
        ▼
useDebounce delays update (300ms)
        │
        ▼
useMemo recalculates filtered data
        │
        ▼
Component re-renders with filtered results
```

### Modal Flow
```
User clicks "View Details"
        │
        ▼
setSelectedClass(classData)
        │
        ▼
Modal isOpen becomes true
        │
        ▼
createPortal renders modal to document.body
        │
        ▼
Body scroll locked
        │
        ▼
User clicks close/ESC/outside
        │
        ▼
setSelectedClass(null)
        │
        ▼
Modal closes, scroll restored
```

### Scroll Animation Flow
```
Component mounts
        │
        ▼
useScrollAnimation creates IntersectionObserver
        │
        ▼
Observer watches element
        │
        ▼
Element enters viewport
        │
        ▼
isVisible becomes true
        │
        ▼
CSS animation class applied
        │
        ▼
Animation plays
```

---

## State Management Strategy

### Local State (useState)
- Component-specific UI state
- Form inputs
- Toggle states
- Modal open/close

### Reducer State (useReducer)
- Complex filter state
- Multiple related state values
- Predictable state updates

### Context State
- Global theme preference
- Shared across all components
- Persisted to localStorage

### Derived State (useMemo)
- Filtered data
- Sorted data
- Computed values
- Expensive calculations

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────┐
│                   Optimization Layers                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Code Splitting (React.lazy)                         │
│     └─▶ Reduces initial bundle size                     │
│                                                          │
│  2. Memoization (React.memo)                            │
│     └─▶ Prevents unnecessary component re-renders       │
│                                                          │
│  3. Computation Caching (useMemo)                       │
│     └─▶ Caches expensive calculations                   │
│                                                          │
│  4. Callback Memoization (useCallback)                  │
│     └─▶ Prevents function recreation                    │
│                                                          │
│  5. Debouncing (useDebounce)                            │
│     └─▶ Reduces rapid state updates                     │
│                                                          │
│  6. Lazy Loading (Intersection Observer)                │
│     └─▶ Defers non-critical rendering                   │
│                                                          │
│  7. CSS Animations (GPU accelerated)                    │
│     └─▶ Smooth 60fps animations                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Hook Dependencies

```
useLocalStorage
    │
    └─▶ useFavorites
    └─▶ ThemeContext

useDebounce
    │
    └─▶ Classes (search)
    └─▶ TrainersPage (search)

useScrollAnimation
    │
    └─▶ Hero
    └─▶ ClassCard
    └─▶ TrainerCard

useCallback
    │
    └─▶ Navbar (menu handlers)
    └─▶ Classes (modal handlers)
    └─▶ TrainersPage (filter handlers)

useMemo
    │
    └─▶ Classes (filtered data)
    └─▶ TrainersPage (filtered data)
    └─▶ Navbar (nav links)
```

---

## Error Handling Strategy

```
┌─────────────────────────────────────────┐
│         Error Boundary (Top Level)      │
│  Catches: Component errors, render      │
│           errors, lifecycle errors      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Try-Catch in Hooks              │
│  Catches: localStorage errors,          │
│           API errors (future)           │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Fallback UI                     │
│  Shows: User-friendly error messages    │
│         Recovery options                │
└─────────────────────────────────────────┘
```

---

## Rendering Pipeline

```
1. Initial Load
   └─▶ App.js loads
       └─▶ ErrorBoundary wraps
           └─▶ ThemeProvider initializes
               └─▶ Theme loaded from localStorage
                   └─▶ Router initializes
                       └─▶ Navbar renders
                           └─▶ Lazy load current route
                               └─▶ Suspense shows loader
                                   └─▶ Page component loads
                                       └─▶ Page renders
                                           └─▶ Footer renders
                                               └─▶ ScrollToTop renders

2. Route Change
   └─▶ User clicks link
       └─▶ Router updates
           └─▶ Suspense shows loader
               └─▶ New page lazy loads
                   └─▶ New page renders
                       └─▶ Scroll to top

3. Theme Change
   └─▶ User clicks theme toggle
       └─▶ Context updates
           └─▶ localStorage saves
               └─▶ CSS variables update
                   └─▶ All components re-render
                       └─▶ Smooth transition

4. Filter Change
   └─▶ User types in search
       └─▶ useState updates
           └─▶ useDebounce delays
               └─▶ useMemo recalculates
                   └─▶ Only filtered list re-renders
```

---

## Bundle Structure (After Build)

```
build/
├── static/
│   ├── js/
│   │   ├── main.[hash].js          (77 KB) - Core app
│   │   ├── 875.[hash].chunk.js     (8 KB)  - Home page
│   │   ├── 762.[hash].chunk.js     (3 KB)  - Classes page
│   │   ├── 408.[hash].chunk.js     (2 KB)  - Trainers page
│   │   ├── 822.[hash].chunk.js     (2 KB)  - Pricing page
│   │   └── ... (other lazy chunks)
│   │
│   └── css/
│       └── main.[hash].css         (6 KB)  - All styles
│
└── index.html
```

**Benefits:**
- Initial load only downloads main bundle + current page
- Other pages load on-demand
- Better caching (unchanged chunks don't re-download)
- Faster initial page load

---

## Memory Management

### Cleanup Strategies

1. **useEffect Cleanup**
   ```javascript
   useEffect(() => {
     // Setup
     return () => {
       // Cleanup
     };
   }, []);
   ```

2. **Event Listener Cleanup**
   - ScrollToTop removes scroll listener
   - Modal removes keydown listener
   - IntersectionObserver disconnects

3. **Body Scroll Lock**
   - Modal locks on open
   - Restores on close
   - Cleanup on unmount

---

## Accessibility Architecture

```
┌─────────────────────────────────────────┐
│         Semantic HTML                   │
│  <nav>, <main>, <section>, <article>   │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         ARIA Attributes                 │
│  aria-label, aria-labelledby,          │
│  aria-expanded, role, aria-modal       │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Keyboard Navigation             │
│  ESC to close modals                    │
│  Tab navigation                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Reduced Motion Support          │
│  @media (prefers-reduced-motion)        │
└─────────────────────────────────────────┘
```

---

## Future Architecture Considerations

### Potential Additions

1. **State Management Library**
   - Redux Toolkit or Zustand
   - For more complex global state

2. **Data Fetching**
   - React Query or SWR
   - For API integration

3. **Form Management**
   - React Hook Form
   - For complex forms

4. **Animation Library**
   - Framer Motion
   - For advanced animations

5. **Testing**
   - Jest + React Testing Library
   - Cypress for E2E

6. **TypeScript**
   - Type safety
   - Better IDE support

---

**This architecture provides:**
- ✅ Scalability
- ✅ Maintainability
- ✅ Performance
- ✅ Developer Experience
- ✅ User Experience
