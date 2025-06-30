import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL,
      to,
      subject: `Reminder: ${subject}`,
      text,
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }
};

export default sendEmail;
