import {render, screen, fireEvent, getByDataSlot} from "@/test-utils";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";
import {authClient} from "@/lib/auth/auth-client";
import ManageHomeProjects from "@/features/projects/components/manage-home-projects";

jest.mock("@/features/subscriptions/hooks/useSubscription", () => ({
  useHasActiveSubscription: jest.fn(),
}));
jest.mock("@/features/projects/components/home-projects", () => ({
  __esModule: true,
  default: () => <div data-testid="home-projects">Home Projects</div>,
}));
jest.mock("@/features/global/components/search-bar-component", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar">Search Bar</div>,
}));
jest.mock("@/features/global/components/filter-component", () => ({
  __esModule: true,
  default: () => <div data-testid="filter">Filter</div>,
}));

describe("ManageHomeProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: true,
      hasActiveSubscription: false,
    });

    render(<ManageHomeProjects />);
    expect(getByDataSlot(document.body, "skeleton")).toBeInTheDocument();
  });

  it("renders subscribe button and alert when no active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<ManageHomeProjects />);

    expect(screen.getByText("Subscribe")).toBeInTheDocument();
    expect(screen.getByText("Heads up!")).toBeInTheDocument();
    expect(
      screen.getByText(/You have to subscribe to create your own projects/i)
    ).toBeInTheDocument();
  });

  it("calls checkout when subscribe button is clicked", async () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<ManageHomeProjects />);

    fireEvent.click(screen.getByText("Subscribe"));
    expect(authClient.checkout).toHaveBeenCalledWith({
      products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
      slug: "pro",
    });
  });

  it("renders create project button when has active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<ManageHomeProjects />);

    expect(screen.getByText("Create Project")).toBeInTheDocument();
    expect(screen.queryByText("Subscribe")).not.toBeInTheDocument();
    expect(screen.queryByText("Heads up!")).not.toBeInTheDocument();
  });

  it("renders child components", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<ManageHomeProjects />);

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("filter")).toBeInTheDocument();
    expect(screen.getByTestId("home-projects")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    const {asFragment} = render(<ManageHomeProjects />);
    expect(asFragment()).toMatchSnapshot();
  });
});
