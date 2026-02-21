import {render, screen, fireEvent} from "@testing-library/react";

import SearchBarComponent from "@/features/global/components/search-bar-component";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {useEntitySearch} from "@/features/global/hooks/use-entity-search";

jest.mock("@/features/global/hooks/use-global-params", () => ({
  useGlobalParams: jest.fn(),
}));
jest.mock("@/features/global/hooks/use-entity-search", () => ({
  useEntitySearch: jest.fn(),
}));

describe("SearchBarComponent", () => {
  const mockParams = {search: "initial", page: 1};
  const mockSetParams = jest.fn();
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    (useGlobalParams as jest.Mock).mockReturnValue([mockParams, mockSetParams]);
    (useEntitySearch as jest.Mock).mockReturnValue({
      searchValue: "initial",
      onSearchChange: mockOnSearchChange,
    });
  });

  it("renders with placeholder and initial value", () => {
    render(<SearchBarComponent placeholder="Search projects..." />);

    const input = screen.getByPlaceholderText("Search projects...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("initial");
  });

  it("calls onSearchChange when typing", () => {
    render(<SearchBarComponent placeholder="Search projects..." />);

    const input = screen.getByPlaceholderText("Search projects...");
    fireEvent.change(input, {target: {value: "new search"}});

    expect(mockOnSearchChange).toHaveBeenCalledWith("new search");
  });
});
