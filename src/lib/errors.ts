// Domain errors shared across the service layer.

/**
 * Thrown when an OTP code doesn't match. Lets callers tell a wrong code
 * apart from a valid code for a brand-new user (which returns null instead).
 */
export class InvalidOtpError extends Error {
  constructor() {
    super("کد تأیید اشتباه است.");
    this.name = "InvalidOtpError";
  }
}
