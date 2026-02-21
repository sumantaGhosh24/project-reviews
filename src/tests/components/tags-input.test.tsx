import {render, screen, fireEvent} from "@testing-library/react";

import {TagsInput} from "@/components/tags-input";

describe("TagsInput", () => {
  it("renders with initial tags", () => {
    const tags = ["tag1", "tag2"];
    render(<TagsInput value={tags} />);

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("adds a tag on Enter", () => {
    const onChange = jest.fn();
    render(<TagsInput value={[]} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Add a tag");
    fireEvent.change(input, {target: {value: "new-tag"}});
    fireEvent.keyDown(input, {key: "Enter"});

    expect(onChange).toHaveBeenCalledWith(["new-tag"]);
  });

  it("adds a tag on comma", () => {
    const onChange = jest.fn();
    render(<TagsInput value={[]} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Add a tag");
    fireEvent.change(input, {target: {value: "new-tag"}});
    fireEvent.keyDown(input, {key: ","});

    expect(onChange).toHaveBeenCalledWith(["new-tag"]);
  });

  it("removes a tag when clicking X", () => {
    const onChange = jest.fn();
    const tags = ["tag1", "tag2"];
    render(<TagsInput value={tags} onChange={onChange} />);

    const xButtons = screen.getAllByRole("button");
    fireEvent.click(xButtons[0]);

    expect(onChange).toHaveBeenCalledWith(["tag2"]);
  });

  it("removes the last tag on Backspace when input is empty", () => {
    const onChange = jest.fn();
    const tags = ["tag1", "tag2"];
    render(<TagsInput value={tags} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Add a tag");
    fireEvent.keyDown(input, {key: "Backspace"});

    expect(onChange).toHaveBeenCalledWith(["tag1"]);
  });

  it("does not remove tag on Backspace if input is not empty", () => {
    const onChange = jest.fn();
    const tags = ["tag1"];
    render(<TagsInput value={tags} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Add a tag");
    fireEvent.change(input, {target: {value: "some text"}});
    fireEvent.keyDown(input, {key: "Backspace"});

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not add duplicate tags", () => {
    const onChange = jest.fn();
    const tags = ["tag1"];
    render(<TagsInput value={tags} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Add a tag");
    fireEvent.change(input, {target: {value: "tag1"}});
    fireEvent.keyDown(input, {key: "Enter"});

    expect(onChange).not.toHaveBeenCalled();
  });
});
