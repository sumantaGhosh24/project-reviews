import {sendEmailVerificationEmail} from "@/lib/email/email-verification";
import {sendEmail} from "@/lib/email/send-email";

jest.mock("@/lib/email/send-email", () => ({
  sendEmail: jest.fn(),
}));

describe("sendEmailVerificationEmail", () => {
  it("sends an email verification email to the user", async () => {
    const user = {name: "Test User", email: "test@example.com"};
    const url = "https://example.com/verify";
    await sendEmailVerificationEmail({user, url});

    expect(sendEmail).toHaveBeenCalledWith({
      to: user.email,
      subject: "Verify your email address",
      html: expect.stringContaining(url),
      text: expect.stringContaining(url),
    });
  });
});
