import {prefetch, trpc} from "@/trpc/server";
import {prefetchNotifications} from "@/features/notifications/server/prefetch";

describe("notifications prefetch", () => {
  it("prefetches notifications with params", async () => {
    const params = {page: 1, pageSize: 10};
    await prefetchNotifications(params);

    expect(trpc.notification.getAll.queryOptions).toHaveBeenCalledWith(params);
    expect(prefetch).toHaveBeenCalledWith({queryKey: ["getAll", params]});
  });
});
