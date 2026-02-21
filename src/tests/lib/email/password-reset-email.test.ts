import {sendPasswordResetEmail} from "@/lib/email/password-reset-email";
import {sendEmail} from "@/lib/email/send-email";

jest.mock("@/lib/email/send-email", () => ({
  sendEmail: jest.fn(),
}));

describe("sendPasswordResetEmail", () => {
  it("sends a password reset email to the user", async () => {
    const user = {name: "Test User", email: "test@example.com"};
    const url = "https://example.com/reset";
    await sendPasswordResetEmail({user, url});

    expect(sendEmail).toHaveBeenCalledWith({
      to: user.email,
      subject: "Reset your password",
      html: expect.stringContaining(url),
      text: expect.stringContaining(url),
    });
  });
});
