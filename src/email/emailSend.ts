import nodemailer from "nodemailer";
import createError from "http-errors";

exports.sendEmail = async (
  email: string,
  message: string,
  subject: string = ""
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: " ",
      port: 465,
      secure: true,
      auth: {
        user: " ",
        pass: " ",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const checkerEmail = await transporter.sendMail({
      from: "consent.v1@gicbdedu.com",
      to: email,
      subject: subject,
      html: message,
    });

    if (checkerEmail) return true;
    else return false;
  } catch (error) {
    createError(400, "Email not sent");
  }
};
