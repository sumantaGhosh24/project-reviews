import {NextRequest, NextResponse} from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const {to, subject, text, html} = await req.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}.container-fluid{width:100%;padding-left:24px;padding-right:24px;margin-right:auto;margin-left:auto}.text-center{text-align:center}.text-white{color:#fff}.mb-5{margin-bottom:48px}</style><title>${subject}</title></head><body><div class="container-fluid text-center mb-5">${html}</div></body></html>`,
    };
    await transporter.sendMail(mailOptions);
    return NextResponse.json({message: "Success!"});
  } catch {
    return NextResponse.json({message: "Failed!"}, {status: 400});
  }
}
