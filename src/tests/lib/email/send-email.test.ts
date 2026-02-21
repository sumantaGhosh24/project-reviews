import {sendEmail} from "@/lib/email/send-email";

describe("sendEmail", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const emailParams = {
    to: "test@example.com",
    subject: "Test Subject",
    text: "Test",
    html: "<p>Test</p>",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BETTER_AUTH_URL = "http://localhost:3000";
  });

  it("sends email successfully", async () => {
    mockFetch.mockResolvedValueOnce({ok: true});

    await sendEmail(emailParams);

    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/api/email", {
      method: "post",
      body: JSON.stringify(emailParams),
    });
  });

  it("handles fetch errors", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await sendEmail(emailParams);

    expect(consoleSpy).toHaveBeenCalledWith("Network error");
    consoleSpy.mockRestore();
  });

  it("handles non-error objects in catch", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    mockFetch.mockRejectedValueOnce("Unknown error");

    await sendEmail(emailParams);

    expect(consoleSpy).toHaveBeenCalledWith("Unknown error");
    consoleSpy.mockRestore();
  });
});
