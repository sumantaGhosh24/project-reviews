import {sendDeleteAccountVerificationEmail} from "@/lib/email/delete-account-verification";
import {sendEmail} from "@/lib/email/send-email";

jest.mock("@/lib/email/send-email", () => ({
  sendEmail: jest.fn(),
}));

describe("sendDeleteAccountVerificationEmail", () => {
  it("sends a delete account verification email to the user", async () => {
    const user = {name: "Test User", email: "test@example.com"};
    const url = "https://example.com/delete";
    await sendDeleteAccountVerificationEmail({user, url});

    expect(sendEmail).toHaveBeenCalledWith({
      to: user.email,
      subject: "Delete your account",
      html: expect.stringContaining(url),
      text: expect.stringContaining(url),
    });
  });
});
