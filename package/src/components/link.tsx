import type { ComponentProps } from "react";
import { $path, type RouteOptions } from "../path";

type LinkBase = Omit<ComponentProps<"a">, "href">;

/** Internal links require `to` and optional route params */
type InternalLinkProps = LinkBase &
  RouteOptions & {
    external?: false;
    href?: never; // Forbid 'href' on internal links to avoid confusion
  };

/** External links require `href` and explicit `external={true}` */
type ExternalLinkProps = LinkBase & {
  external: true;
  href: string;
  to?: never; // Forbid 'to' on external links
};

export type ReactLinkProps = InternalLinkProps | ExternalLinkProps;

export default function Link({ external = false, ...props }: ReactLinkProps) {
  if (external) {
    // External link: treat as standard <a>
    const { children, ...rest } = props as ExternalLinkProps;
    return <a {...rest}>{children}</a>;
  }

  // Internal link: treat as type-safe route
  // We extract route-specific props so they don't leak to the <a> tag
  const {
    to,
    params,
    locale,
    search,
    hash,
    children,
    ...anchorProps
  } = props as InternalLinkProps;

  const resolvedHref = $path({ to, params, locale, search, hash });

  return (
    <a href={resolvedHref} {...anchorProps}>
      {children}
    </a>
  );
}