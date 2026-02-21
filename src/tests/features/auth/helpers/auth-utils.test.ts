import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {auth} from "@/lib/auth/auth";
import {polarClient} from "@/lib/polar";
import {
  requireAuth,
  requireUnauth,
  requireAdmin,
  requireSubscription,
} from "@/features/auth/helpers/auth-utils";

describe("auth-utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("requireAuth", () => {
    it("returns session if authenticated", async () => {
      const mockSession = {user: {id: "1"}};
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(
        mockSession
      );
      (headers as jest.Mock).mockResolvedValue({});

      const result = await requireAuth();

      expect(result).toBe(mockSession);
      expect(redirect).not.toHaveBeenCalled();
    });

    it("redirects to /login if not authenticated", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(null);
      (headers as jest.Mock).mockResolvedValue({});

      try {
        await requireAuth();
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("requireUnauth", () => {
    it("redirects to /home if authenticated", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
        user: {id: "1"},
      });
      (headers as jest.Mock).mockResolvedValue({});

      try {
        await requireUnauth();
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(redirect).toHaveBeenCalledWith("/home");
    });

    it("does not redirect if not authenticated", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(null);
      (headers as jest.Mock).mockResolvedValue({});

      await requireUnauth();

      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("requireAdmin", () => {
    it("redirects to /login if not authenticated", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(null);
      (headers as jest.Mock).mockResolvedValue({});

      try {
        await requireAdmin();
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("redirects to /home if user is not an admin", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
        user: {role: "user"},
      });
      (headers as jest.Mock).mockResolvedValue({});

      try {
        await requireAdmin();
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(redirect).toHaveBeenCalledWith("/home");
    });

    it("does not redirect if user is an admin", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
        user: {role: "admin"},
      });
      (headers as jest.Mock).mockResolvedValue({});

      await requireAdmin();

      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("requireSubscription", () => {
    it("redirects to /login if not authenticated", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(null);
      (headers as jest.Mock).mockResolvedValue({});

      try {
        await requireSubscription();
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("redirects to /home if no active subscriptions", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
        user: {id: "1"},
      });
      (headers as jest.Mock).mockResolvedValue({});
      (polarClient.customers.getStateExternal as jest.Mock).mockResolvedValue({
        activeSubscriptions: [],
      });

      try {
        await requireSubscription();
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(redirect).toHaveBeenCalledWith("/home");
    });

    it("does not redirect if active subscriptions exist", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
        user: {id: "1"},
      });
      (headers as jest.Mock).mockResolvedValue({});
      (polarClient.customers.getStateExternal as jest.Mock).mockResolvedValue({
        activeSubscriptions: [{id: "sub1"}],
      });

      await requireSubscription();

      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
