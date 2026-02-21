import {TRPCError} from "@trpc/server";

import prisma from "@/lib/db";
import {auth} from "@/lib/auth/auth";
import {categoriesRouter} from "@/features/categories/server/router";

describe("categoriesRouter", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = {session: {user: {role: "admin"}}};

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue({
      user: {id: "u1", role: "admin"},
      session: {id: "s1"},
    });
  });

  describe("create", () => {
    it("creates a new category if it doesn't exist", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.category.create as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Tech",
      });

      const caller = categoriesRouter.createCaller(ctx);
      const result = await caller.create({name: "Tech"});

      expect(result).toEqual({id: "1", name: "Tech"});
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {name: "Tech"},
      });
    });

    it("throws error if category already exists", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        name: "tech",
      });

      const caller = categoriesRouter.createCaller(ctx);
      await expect(caller.create({name: "Tech"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Category already exists.",
        })
      );
    });
  });

  describe("remove", () => {
    it("deletes a category if no projects are associated", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.category.delete as jest.Mock).mockResolvedValue({id: "1"});

      const caller = categoriesRouter.createCaller(ctx);
      const result = await caller.remove({id: "1"});

      expect(result).toEqual({id: "1"});
      expect(prisma.category.delete).toHaveBeenCalledWith({where: {id: "1"}});
    });

    it("throws error if projects are associated with the category", async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({id: "p1"});

      const caller = categoriesRouter.createCaller(ctx);
      await expect(caller.remove({id: "1"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Please delete all project of this category first.",
        })
      );
    });
  });

  describe("update", () => {
    it("updates an existing category", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Old",
      });
      (prisma.category.update as jest.Mock).mockResolvedValue({
        id: "1",
        name: "New",
      });

      const caller = categoriesRouter.createCaller(ctx);
      const result = await caller.update({id: "1", name: "New"});

      expect(result).toEqual({id: "1", name: "New"});
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: {id: "1"},
        data: {name: "New"},
      });
    });

    it("throws error if category not found", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const caller = categoriesRouter.createCaller(ctx);
      await expect(caller.update({id: "1", name: "New"})).rejects.toThrow(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "Category not found.",
        })
      );
    });
  });

  describe("getAll", () => {
    it("returns all categories", async () => {
      const mockCategories = [{id: "1", name: "Tech"}];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const caller = categoriesRouter.createCaller({
        session: {user: {role: "user"}},
      });
      const result = await caller.getAll();

      expect(result).toEqual(mockCategories);
    });
  });

  describe("getAllPaginated", () => {
    it("returns paginated categories", async () => {
      const mockCategories = [{id: "1", name: "Tech"}];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);
      (prisma.category.count as jest.Mock).mockResolvedValue(1);

      const caller = categoriesRouter.createCaller(ctx);
      const result = await caller.getAllPaginated({
        page: 1,
        pageSize: 10,
        search: "T",
      });

      expect(result.items).toEqual(mockCategories);
      expect(result.totalCount).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
    });
  });

  describe("getOne", () => {
    it("returns a single category", async () => {
      const mockCategory = {id: "1", name: "Tech"};
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

      const caller = categoriesRouter.createCaller(ctx);
      const result = await caller.getOne({id: "1"});

      expect(result).toEqual(mockCategory);
    });
  });
});
