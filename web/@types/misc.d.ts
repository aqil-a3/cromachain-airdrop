interface CaptchaResponse {
  success: boolean;
  challenge_ts: timestamp;
  hostname: string;
  "error-codes"?: string[];
}
