import nodemailer from "nodemailer";

const getEmailHtml = (title, description) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
          <h1 style="color: #444;">🛎️ Reminder!</h1>
        </div>
        <div style="padding: 20px 0;">
          <h2 style="color: #555;">${title}</h2>
          <p>${description || 'You have a reminder scheduled.'}</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9em; color: #777;">
          <p>Thank you for using the Online Reminder System!</p>
          <p style="margin-top: 20px; font-weight: bold;">
            Ashutosh<br>
            <span style="font-weight: normal;">Application Owner</span>
          </p>
        </div>
      </div>
    </div>
  `;
};

const sendEmail = async (to, subject, description) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Online Reminder System" <${process.env.MAIL}>`,
      to,
      subject: `Reminder: ${subject}`,
      html: getEmailHtml(subject, description),
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }
};

export default sendEmail;
