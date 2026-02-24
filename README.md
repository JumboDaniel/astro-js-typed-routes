# Astro JS Typesafe Routes

**Type-safe routing for Astro.** Auto-generated route definitions, typed links, and URL builders.

## Features

- 🚀 **Auto-generated types**: Scans your `src/pages` and generates strict types for all your routes.
- 🔗 **Type-safe Link component**: Drop-in replacement for `<a>` that requires valid routes.
- 🛠️ **$path() builder**: Construct URLs programmatically with type safety.
- 🧩 **Dynamic Params**: Strict typing for route parameters (e.g. `[slug]`).
- 🌐 **i18n Ready**: Works seamlessly with Astro's i18n routing.

## Installation

```bash
pnpm add astro-js-typesafe-routes
```

## Setup

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import typedRoutes from "astro-js-typesafe-routes";

export default defineConfig({
  integrations: [typedRoutes()],
});
```

Run your dev server (`pnpm dev`) to generate the initial types.

## Usage

### 1. Type-Safe Links

Use the `Link` component for navigation. It validates your `to` prop against your actual routes.

**React:**

```tsx
import Link from "astro-js-typesafe-routes/link-react";

// ✅ Valid route
<Link to="/about">About Us</Link>

// ✅ Valid dynamic route (requires params!)
<Link to="/blog/[slug]" params={{ slug: "hello-world" }}>
  Read Post
</Link>

// ❌ TypeScript Error: Route doesn't exist
<Link to="/invalid-page" />

// ❌ TypeScript Error: Missing 'slug' param
<Link to="/blog/[slug]" />
```

**Astro:**

```astro
---
import Link from "astro-js-typesafe-routes/link";
---

<Link to="/contact">Contact</Link>
```

### 2. External Links

For external URLs, use the `href` prop (and `to` is forbidden).

```tsx
<Link external href="https://github.com">
  GitHub
</Link>
```

### 3. Programmatic URLs (`$path`)

Use `$path` to build URL strings safely in your scripts or server-side code.

```ts
import { $path } from "astro-js-typesafe-routes/path";

const url = $path({
  to: "/blog/[slug]",
  params: { slug: "my-post" },
  search: { ref: "newsletter" },
  hash: "comments",
});

// Output: "/blog/my-post?ref=newsletter#comments"
```

### 4. Runtime Route Object (`ROUTES`)

Access route definitions at runtime if needed. Params must be passed explicitly.

```ts
import { ROUTES } from "astro-js-typesafe-routes/routes"; // Generated file

// Static route
const home = ROUTES.index(); // -> "/"

// Dynamic route
const post = ROUTES["[lng]"].index({ lng: "en" }); // -> "/en"
```

### 5. Helper Utilities (`createRoute`)

Create reusable route helpers bound to a specific path.

```ts
import { createRoute } from "astro-js-typesafe-routes/create-route";

const BlogPost = createRoute({ routeId: "/blog/[slug]" });

export const getStaticPaths = BlogPost.createGetStaticPaths(async () => {
  // ...
});

export function GET(astro) {
  // Type-safe params access
  const { slug } = BlogPost.getParams(astro);
}
```

## License

MIT
