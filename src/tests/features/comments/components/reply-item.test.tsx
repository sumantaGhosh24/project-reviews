/* eslint-disable @typescript-eslint/no-explicit-any */
import {render, screen} from "@testing-library/react";

import {ReplyItem} from "@/features/comments/components/reply-item";

describe("ReplyItem", () => {
  const mockReply = {
    id: "reply-123",
    body: "This is a reply body",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    author: {
      id: "author-123",
      name: "John Doe",
      image: "https://example.com/avatar.png",
    },
    image: null,
    releaseId: "release-123",
    authorId: "author-123",
    parentId: "comment-123",
  };

  it("renders correctly with author name and body", () => {
    render(<ReplyItem reply={mockReply as any} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("This is a reply body")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: /John Doe/i})).toHaveAttribute(
      "href",
      "/profile/details/author-123"
    );
  });

  it("renders italicized body if deleted", () => {
    const deletedReply = {...mockReply, deletedAt: new Date()};
    render(<ReplyItem reply={deletedReply as any} />);

    const bodyText = screen.getByText("This is a reply body");
    expect(bodyText).toHaveClass("italic");
    expect(bodyText).toHaveClass("text-muted-foreground");
  });

  it("renders image if provided", () => {
    const replyWithImage = {
      ...mockReply,
      image: "https://example.com/reply-img.png",
    };
    render(<ReplyItem reply={replyWithImage as any} />);

    const image = screen.getByAltText("Image");
    expect(image).toBeInTheDocument();
    // Next.js Image mock usually handles src
  });

  it("renders avatar fallback if no image", () => {
    const replyNoAvatar = {
      ...mockReply,
      author: {...mockReply.author, image: null},
    };
    render(<ReplyItem reply={replyNoAvatar as any} />);

    expect(screen.getByText("Jo")).toBeInTheDocument();
  });
});
