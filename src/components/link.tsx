import type { ComponentProps } from "react";
import { $path, type RouteOptions } from "../path";

type InternalLinkProps = Omit<ComponentProps<"a">, "href"> &
  RouteOptions & { external?: false };

type ExternalLinkProps = Omit<ComponentProps<"a">, "href"> & {
  external: true;
  href: string;
};

export type ReactLinkProps = InternalLinkProps | ExternalLinkProps;

export default function Link(props: ReactLinkProps) {
  if (props.external) {
    const { external: _, children, ...rest } = props;
    return <a {...rest}>{children}</a>;
  }

  const { to, params, locale, search, hash, children, ...anchorProps } = props;
  const href = $path({ to, params, locale, search, hash });

  return (
    <a href={href} {...anchorProps}>
      {children}
    </a>
  );
}
