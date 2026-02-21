import {sendWelcomeEmail} from "@/lib/email/welcome-email";
import {sendEmail} from "@/lib/email/send-email";

jest.mock("@/lib/email/send-email", () => ({
  sendEmail: jest.fn(),
}));

describe("sendWelcomeEmail", () => {
  it("sends a welcome email to the user", async () => {
    const user = {name: "Test User", email: "test@example.com"};
    await sendWelcomeEmail(user);

    expect(sendEmail).toHaveBeenCalledWith({
      to: user.email,
      subject: "Welcome to Our App!",
      html: expect.stringContaining(`Hello ${user.name}`),
      text: expect.stringContaining(`Hello ${user.name}`),
    });
  });
});
