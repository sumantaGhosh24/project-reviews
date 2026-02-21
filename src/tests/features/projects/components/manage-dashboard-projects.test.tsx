import {render, screen, fireEvent, getByDataSlot} from "@/test-utils";
import {useHasActiveSubscription} from "@/features/subscriptions/hooks/useSubscription";
import {authClient} from "@/lib/auth/auth-client";
import ManageDashboardProjects from "@/features/projects/components/manage-dashboard-projects";

jest.mock("@/features/subscriptions/hooks/useSubscription", () => ({
  useHasActiveSubscription: jest.fn(),
}));
jest.mock("@/features/projects/components/dashboard-projects-table", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="dashboard-projects-table">Dashboard Projects Table</div>
  ),
}));
jest.mock("@/features/global/components/search-bar-component", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar">Search Bar</div>,
}));
jest.mock("@/features/global/components/filter-component", () => ({
  __esModule: true,
  default: () => <div data-testid="filter">Filter</div>,
}));

describe("ManageDashboardProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: true,
      hasActiveSubscription: false,
    });

    render(<ManageDashboardProjects />);
    expect(getByDataSlot(document.body, "skeleton")).toBeInTheDocument();
  });

  it("renders subscribe button and alert when no active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<ManageDashboardProjects />);

    expect(screen.getByText("Subscribe")).toBeInTheDocument();
    expect(screen.getByText("Heads up!")).toBeInTheDocument();
  });

  it("does not show subscription alert when user has active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<ManageDashboardProjects />);

    expect(screen.queryByText("Heads up!")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "You have to subscribe to create your own projects."
      )
    ).not.toBeInTheDocument();
  });

  it("calls checkout when subscribe button is clicked", async () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    render(<ManageDashboardProjects />);

    fireEvent.click(screen.getByText("Subscribe"));
    expect(authClient.checkout).toHaveBeenCalled();
  });

  it("renders create project button when has active subscription", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<ManageDashboardProjects />);

    expect(screen.getByText("Create Project")).toBeInTheDocument();
  });

  it("renders child components", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: true,
    });

    render(<ManageDashboardProjects />);

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("filter")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-projects-table")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    (useHasActiveSubscription as jest.Mock).mockReturnValue({
      isLoading: false,
      hasActiveSubscription: false,
    });

    const {asFragment} = render(<ManageDashboardProjects />);
    expect(asFragment()).toMatchSnapshot();
  });
});
