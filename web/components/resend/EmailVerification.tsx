import { verifyEmailUrl } from "../../lib/resend/variables/basePath";

interface VerifyEmailProps {
  token: string;
  userName?: string;
}

export default function VerifyEmailEmail({
  token,
  userName = "there",
}: VerifyEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", lineHeight: "1.5" }}>
      <h2>Hi {userName},</h2>
      <p>
        Thanks for signing up! Please verify your email address to activate your
        account.
      </p>
      <p>
        Here is your verification code: <strong>{token}</strong>
      </p>
      <p>
        Or click the button below to verify your email. This link will expire in
        10 minutes.
      </p>
      <p>
        <a
          href={`${verifyEmailUrl}?token=${token}`}
          style={{
            backgroundColor: "#f97316",
            color: "white",
            padding: "10px 16px",
            borderRadius: "5px",
            textDecoration: "none",
            display: "inline-block",
            marginTop: "12px",
          }}
        >
          Verify Email
        </a>
      </p>
      <p>
        If you did not create this account, you can safely ignore this email.
      </p>
      <hr />
      <p style={{ fontSize: "12px", color: "#888" }}>
        This email was sent by Cromachain Airdrop.
      </p>
    </div>
  );
}
