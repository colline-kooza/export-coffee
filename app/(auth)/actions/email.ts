import { Resend } from "resend";

const resend = new Resend(process.env.REND_API_KEY);

export async function sendVendorVerificationEmail(email: string, otp: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: "Verification <info@desishub.com>",
			to: [email],
			subject: "Verify Your Email Address",
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">Verify Your Email</h1>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #475569;">Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; margin: 15px 0; padding: 10px; background-color: white; border-radius: 4px; display: inline-block;">
              ${otp}
            </div>
          </div>
          <div style="color: #64748b; font-size: 14px; text-align: center;">
            <p style="margin: 10px 0;">This code will expire in 10 minutes.</p>
            <p style="margin: 10px 0;">If you didn't request this verification, please ignore this email.</p>
          </div>
          <div style="border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
          </div>
        </div>
      `,
		});

		if (error) {
			console.error("Resend API Error:", error);
			throw new Error(`Failed to send email: ${error.message}`);
		}

		console.log("Email sent successfully:", data);
		return data;
	} catch (error) {
		console.error("Failed to send verification email:", error);
		throw error;
	}
}
