/** @vitest-environment jsdom */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Home from "./page";

// vitest globals are off, so RTL's automatic cleanup never registers.
afterEach(cleanup);

// next/image, next/link, and useRouter need app-router context jsdom lacks.
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    priority,
    ...rest
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    void priority; // test env has no next/image optimizer — plain img instead
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} {...rest} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("Landing page", () => {
  it("renders the headline and hero logo", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /surprise/i }),
    ).toBeDefined();
    expect(
      screen.getByAltText("Wishire — surprise gift box with a letter"),
    ).toBeDefined();
  });

  it("explains the app, the audience, and the four steps", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "A gift that lives in a link" }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "Made for the people you care about" }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "From idea to link in four steps" }),
    ).toBeDefined();

    for (const step of [
      "Start creating",
      "Tell your story",
      "Add a surprise gate",
      "Publish & share",
    ]) {
      expect(screen.getByRole("heading", { name: step })).toBeDefined();
    }
  });

  it("links footer navigation to real routes and anchors", () => {
    render(<Home />);

    const footer = screen.getByRole("contentinfo");
    expect(footer.querySelector('a[href="#how"]')).not.toBeNull();
    expect(footer.querySelector('a[href="#features"]')).not.toBeNull();
    expect(footer.querySelector('a[href="/login"]')).not.toBeNull();
    expect(footer.querySelector('a[href="/signup"]')).not.toBeNull();
    expect(footer.querySelector('a[href="/dashboard"]')).not.toBeNull();
  });

  it("offers Start Creating in the header, hero, CTA band, and footer", () => {
    render(<Home />);

    expect(
      screen.getAllByRole("button", { name: /start creating/i }).length,
    ).toBeGreaterThanOrEqual(4);
  });
});
