import {prefetch, trpc} from "@/trpc/server";
import {
  prefetchCategories,
  prefetchAllCategory,
  prefetchCategory,
} from "@/features/categories/server/prefetch";

describe("categories prefetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prefetches paginated categories", async () => {
    const params = {page: 1, pageSize: 10, search: ""};
    await prefetchCategories(params);

    expect(trpc.category.getAllPaginated.queryOptions).toHaveBeenCalledWith(
      params
    );
    expect(prefetch).toHaveBeenCalledWith({
      queryKey: ["getAllPaginated", params],
    });
  });

  it("prefetches all categories", async () => {
    await prefetchAllCategory();

    expect(trpc.category.getAll.queryOptions).toHaveBeenCalled();
    expect(prefetch).toHaveBeenCalledWith({queryKey: ["getAll"]});
  });

  it("prefetches a single category", async () => {
    const id = "1";
    await prefetchCategory(id);

    expect(trpc.category.getOne.queryOptions).toHaveBeenCalledWith({id});
    expect(prefetch).toHaveBeenCalledWith({queryKey: ["getOne", {id}]});
  });
});
