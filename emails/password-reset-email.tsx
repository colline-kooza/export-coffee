import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export type PasswordResetEmailProps = {
  userEmail: string;
  resetLink: string;
  expirationTime: string;
};
const PasswordResetEmail = (props: PasswordResetEmailProps) => {
  const { userEmail, resetLink, expirationTime } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your Ads Market Pro password</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Ads Market Pro
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Digital Marketing Solutions
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 mb-[16px]">
                Reset Your Password
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                Hi there,
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                We received a request to reset the password for your Ads Market
                Pro account associated with <strong>{userEmail}</strong>.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                Click the button below to create a new password:
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[24px]">
                <Button
                  href={resetLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-[12px] px-[24px] rounded-[6px] text-[16px] no-underline box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] leading-[20px]">
                Or copy and paste this link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[24px] break-all">
                <Link href={resetLink} className="text-blue-600 underline">
                  {resetLink}
                </Link>
              </Text>

              {/* Security Information */}
              <Section className="bg-yellow-50 border-l-[4px] border-yellow-400 p-[16px] mb-[24px]">
                <Text className="text-[14px] text-gray-700 m-0 mb-[8px] font-semibold">
                  Important Security Information:
                </Text>
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  • This link will expire in {expirationTime}
                </Text>
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  • If you didn't request this reset, please ignore this email
                </Text>
                <Text className="text-[14px] text-gray-600 m-0">
                  • Your current password remains unchanged until you create a
                  new one
                </Text>
              </Section>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                If you're having trouble with the button above, you can also
                reset your password by logging into your account and navigating
                to your account settings.
              </Text>

              <Text className="text-[16px] text-gray-700 leading-[24px]">
                If you have any questions or need assistance, please don't
                hesitate to contact our support team.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px] mt-[32px]">
              <Text className="text-[14px] text-gray-600 text-center mb-[8px]">
                Best regards,
                <br />
                The Ads Market Pro Team
              </Text>

              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                Ads Market Pro Digital Marketing Solutions
              </Text>

              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                123 Business Avenue, Marketing District, Kampala, Uganda
              </Text>

              <Text className="text-[12px] text-gray-500 text-center m-0">
                <Link href="#" className="text-gray-500 underline">
                  Unsubscribe
                </Link>{" "}
                |
                <Link href="#" className="text-gray-500 underline ml-[4px]">
                  Privacy Policy
                </Link>{" "}
                |
                <Link href="#" className="text-gray-500 underline ml-[4px]">
                  Contact Support
                </Link>
              </Text>

              <Text className="text-[12px] text-gray-400 text-center m-0 mt-[16px]">
                © 2025 Ads Market Pro. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PasswordResetEmail.PreviewProps = {
  userEmail: "gmukejohnbaptist@gmail.com",
  resetLink: "https://adsmarketpro.com/reset-password?token=abc123xyz789",
  expirationTime: "24 hours",
};

export default PasswordResetEmail;
