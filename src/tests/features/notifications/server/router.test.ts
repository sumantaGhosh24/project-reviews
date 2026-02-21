import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {notificationsRouter} from "@/features/notifications/server/router";

describe("notificationsRouter", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = {
    auth: {
      user: {id: "u1"},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: {id: "u1", role: "user"},
      session: {id: "s1"},
    });
  });

  describe("notificationCount", () => {
    it("returns the count of unread notifications", async () => {
      (prisma.notification.count as jest.Mock).mockResolvedValue(5);

      const caller = notificationsRouter.createCaller(ctx);
      const result = await caller.notificationCount();

      expect(result).toBe(5);
      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: {recipientId: "u1", readAt: null},
      });
    });
  });

  describe("getAll", () => {
    it("returns paginated notifications and unread count", async () => {
      (prisma.notification.findMany as jest.Mock).mockResolvedValue([
        {id: "n1"},
      ]);
      (prisma.notification.count as jest.Mock)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      const caller = notificationsRouter.createCaller(ctx);
      const result = await caller.getAll({page: 1, pageSize: 10});

      expect(result.items).toHaveLength(1);
      expect(result.unreadCount).toBe(1);
      expect(result.totalCount).toBe(1);
    });
  });

  describe("readAll", () => {
    it("marks all unread notifications as read", async () => {
      (prisma.notification.updateMany as jest.Mock).mockResolvedValue({
        count: 5,
      });

      const caller = notificationsRouter.createCaller(ctx);
      const result = await caller.readAll();

      expect(result.count).toBe(5);
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {recipientId: "u1", readAt: null},
        data: expect.objectContaining({readAt: expect.any(Date)}),
      });
    });
  });

  describe("readOne", () => {
    it("marks a single notification as read", async () => {
      (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
        user: {id: "u1", role: "admin"},
        session: {id: "s1"},
      });
      (prisma.notification.updateMany as jest.Mock).mockResolvedValue({
        count: 1,
      });

      const caller = notificationsRouter.createCaller(ctx);
      const result = await caller.readOne({id: "n1"});

      expect(result.count).toBe(1);
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {id: "n1", recipientId: "u1", readAt: null},
        data: expect.objectContaining({readAt: expect.any(Date)}),
      });
    });
  });
});
