import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import PlatformAdminConsole from "@/pages/campus/PlatformAdminConsole";

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "staging.admin@aivicampus.com", uid: "test-admin-uid" },
    tenant: { role: "platform_admin" },
    isAdmin: true,
    signOut: vi.fn(),
  }),
}));

// Mock firebase
vi.mock("@/integrations/firebase/client", () => ({
  functions: {},
  getDb: () => ({}),
  db: {},
  auth: { currentUser: { uid: "test-admin-uid" } },
}));

// Mock firestore queries
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
  query: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  setDoc: vi.fn(),
}));

describe("PlatformAdminConsole Render & White Screen Guard", () => {
  it("renders PlatformAdminConsole cleanly when tenants list is empty without throwing ReferenceError", async () => {
    // Clear any saved local tenants
    localStorage.removeItem("aivi_demo_created_tenants");

    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <PlatformAdminConsole />
        </BrowserRouter>
      </HelmetProvider>
    );

    // Verify main card title renders
    expect(await screen.findByText(/Institutional Tenants Directory/i)).toBeInTheDocument();

    // Verify empty state renders gracefully without ReferenceError
    expect(await screen.findByText(/No Institutional Tenants Found/i)).toBeInTheDocument();
    expect((await screen.findAllByText(/Provision Campus/i)).length).toBeGreaterThan(0);

    // Verify container is not empty (no white screen)
    expect(container.firstChild).not.toBeNull();
  });

  it("renders TPO Administrator card with Manage/Reassign TPO button when tenant is present", async () => {
    const mockTenant = {
      tenantId: "t-sunrise",
      code: "sunrise",
      name: "Sunrise Engineering College",
      type: "college",
      plan: "pro",
      status: "active",
      seatsUsed: 120,
      maxSeats: 1000,
      adminEmail: "sovanbarik07@gmail.com",
      adminName: "Sovan Barik",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("aivi_demo_created_tenants", JSON.stringify([mockTenant]));

    render(
      <HelmetProvider>
        <BrowserRouter>
          <PlatformAdminConsole />
        </BrowserRouter>
      </HelmetProvider>
    );

    // Verify tenant name and TPO admin details render
    expect(await screen.findByText(/Sunrise Engineering College/i)).toBeInTheDocument();
    expect(screen.getByText(/Sovan Barik/i)).toBeInTheDocument();
    expect(screen.getByText(/sovanbarik07@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary TPO Administrator/i)).toBeInTheDocument();

    // Verify Manage / Reassign TPO button is present
    const manageBtn = screen.getByRole("button", { name: /Manage \/ Reassign TPO/i });
    expect(manageBtn).toBeInTheDocument();
  });
});

