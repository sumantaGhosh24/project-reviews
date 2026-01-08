export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    await fetch(`${process.env.BETTER_AUTH_URL}/api/email`, {
      method: "post",
      body: JSON.stringify({to, subject, text, html}),
    });
    return;
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
  }
}
