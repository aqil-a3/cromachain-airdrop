import { resetPasswordUrl } from "../../lib/resend/variables/basePath";

interface ResetPasswordEmailProps {
  token: string;
  userName?: string;
}

export default function ResetPasswordEmail({
  token,
  userName = "there",
}: ResetPasswordEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", lineHeight: "1.5" }}>
      <h2>Hi {userName},</h2>
      <p>You requested to reset your password.</p>
      <p>Here your token {token} </p>
      <p>
        Or you can click the link below to set a new password. This link will expire in 10
        minutes.
      </p>
      <p>
        <a
          href={`${resetPasswordUrl}?token=${token}`}
          style={{
            backgroundColor: "#6366f1",
            color: "white",
            padding: "10px 16px",
            borderRadius: "5px",
            textDecoration: "none",
            display: "inline-block",
            marginTop: "12px",
          }}
        >
          Reset Password
        </a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <hr />
      <p style={{ fontSize: "12px", color: "#888" }}>
        This email was sent by Cromachain Airdrop.
      </p>
    </div>
  );
}
