/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { ClaimBanner } from "./claim-banner";

const authMock = {
  getUser: vi.fn(),
  updateUser: vi.fn(),
  linkIdentity: vi.fn(),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: authMock }),
}));

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.clearAllMocks();
});

const ANON_USER = { id: "u-1", is_anonymous: true, email: null };
const CLAIMED_USER = { id: "u-1", is_anonymous: false, email: "me@example.com" };

describe("ClaimBanner", () => {
  it("renders the claim prompt for anonymous sessions", async () => {
    authMock.getUser.mockResolvedValue({ data: { user: ANON_USER } });
    render(<ClaimBanner />);

    await waitFor(() =>
      expect(screen.getByText("Keep this wish forever")).toBeDefined(),
    );
    expect(screen.getByRole("button", { name: /link email/i })).toBeDefined();
    expect(screen.getByRole("button", { name: "Link Google" })).toBeDefined();
  });

  it("renders nothing for claimed or signed-out sessions", async () => {
    authMock.getUser.mockResolvedValue({ data: { user: CLAIMED_USER } });
    const { container } = render(<ClaimBanner />);
    await waitFor(() => expect(authMock.getUser).toHaveBeenCalled());
    expect(container.innerHTML).toBe("");
  });

  it("stays hidden for the rest of the tab session after dismiss", async () => {
    sessionStorage.setItem("wishire_claim_dismissed", "1");
    authMock.getUser.mockResolvedValue({ data: { user: ANON_USER } });
    const { container } = render(<ClaimBanner />);
    await waitFor(() => expect(authMock.getUser).toHaveBeenCalled());
    expect(container.innerHTML).toBe("");
  });

  it("sends the confirmation email on submit", async () => {
    authMock.getUser.mockResolvedValue({ data: { user: ANON_USER } });
    authMock.updateUser.mockResolvedValue({ error: null });
    render(<ClaimBanner />);

    const input = await screen.findByLabelText("Email to link this account");
    fireEvent.change(input, { target: { value: "me@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /link email/i }));

    await waitFor(() => expect(authMock.updateUser).toHaveBeenCalledTimes(1));
    expect(authMock.updateUser).toHaveBeenCalledWith({
      email: "me@example.com",
    });
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("Check your email"),
    );
  });
});
