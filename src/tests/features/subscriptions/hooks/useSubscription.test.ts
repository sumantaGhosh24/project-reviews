import {createElement} from "react";
import {renderHook, waitFor} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {authClient} from "@/lib/auth/auth-client";
import {
  useSubscription,
  useHasActiveSubscription,
} from "@/features/subscriptions/hooks/useSubscription";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("useSubscription", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });

  it("fetches subscription data", async () => {
    const mockData = {id: "cust_123", activeSubscriptions: []};
    (authClient.customer.state as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const wrapper = ({children}: {children: React.ReactNode}) =>
      createElement(QueryClientProvider, {client: queryClient}, children);

    const {result} = renderHook(() => useSubscription(), {wrapper});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(authClient.customer.state).toHaveBeenCalled();
  });
});

describe("useHasActiveSubscription", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });

  it("returns hasActiveSubscription as true when there are active subscriptions", async () => {
    const mockData = {
      activeSubscriptions: [{id: "sub_123", status: "active"}],
    };
    (authClient.customer.state as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const wrapper = ({children}: {children: React.ReactNode}) =>
      createElement(QueryClientProvider, {client: queryClient}, children);

    const {result} = renderHook(() => useHasActiveSubscription(), {wrapper});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasActiveSubscription).toBe(true);
    expect(result.current.subscription).toEqual(
      mockData.activeSubscriptions[0]
    );
  });

  it("returns hasActiveSubscription as false when there are no active subscriptions", async () => {
    const mockData = {activeSubscriptions: []};
    (authClient.customer.state as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const wrapper = ({children}: {children: React.ReactNode}) =>
      createElement(QueryClientProvider, {client: queryClient}, children);

    const {result} = renderHook(() => useHasActiveSubscription(), {wrapper});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasActiveSubscription).toBe(false);
    expect(result.current.subscription).toBeUndefined();
  });

  it("returns hasActiveSubscription as false when customer state is null", async () => {
    (authClient.customer.state as jest.Mock).mockResolvedValue({data: null});

    const wrapper = ({children}: {children: React.ReactNode}) =>
      createElement(QueryClientProvider, {client: queryClient}, children);

    const {result} = renderHook(() => useHasActiveSubscription(), {wrapper});

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasActiveSubscription).toBeUndefined();
  });
});
