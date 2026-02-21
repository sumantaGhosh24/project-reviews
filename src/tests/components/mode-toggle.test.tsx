import {render, screen, fireEvent} from "@testing-library/react";
import {useTheme} from "next-themes";

import {ModeToggle} from "@/components/mode-toggle";

describe("ModeToggle", () => {
  it("matches snapshot", () => {
    const {asFragment} = render(<ModeToggle />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the toggle button", () => {
    render(<ModeToggle />);
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });

  it("calls setTheme with 'light' when light option is clicked", () => {
    const {setTheme} = useTheme();
    render(<ModeToggle />);

    fireEvent.click(screen.getByText("Toggle theme"));
    fireEvent.click(screen.getByText("Light"));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with 'dark' when dark option is clicked", () => {
    const {setTheme} = useTheme();
    render(<ModeToggle />);

    fireEvent.click(screen.getByText("Toggle theme"));
    fireEvent.click(screen.getByText("Dark"));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'system' when system option is clicked", () => {
    const {setTheme} = useTheme();
    render(<ModeToggle />);

    fireEvent.click(screen.getByText("Toggle theme"));
    fireEvent.click(screen.getByText("System"));

    expect(setTheme).toHaveBeenCalledWith("system");
  });
});
