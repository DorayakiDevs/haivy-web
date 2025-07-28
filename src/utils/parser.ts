export function getNameInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  const func = (a: string[]) => a.map((word) => word[0].toUpperCase()).join("");

  if (parts.length === 0) {
    return "-";
  }

  if (parts.length >= 4) {
    return func(parts.slice(-2));
  }

  return func(parts);
}

export function getUserAvatar(
  user: { full_name: string } | null,
  urlOnly = false
) {
  const initial = getNameInitials(user?.full_name || "-");

  const urls = [`https://placehold.co/256/212b00/f1ffc4/?text=${initial}`];

  if (urlOnly) {
    return urls[0];
  }

  return urls.map((url) => `url('${url}')`).join(", ");
}

export function parseError(error: { code?: string }) {
  if (!error?.code) return "An unknown error occurred.";

  const messages: Record<string, string> = {
    // PostgreSQL common errors
    "23505": "This record already exists",
    "23503": "This action would break a relationship between records",
    "23502": "A required field is missing",
    "42703": "There is an internal reference to an unknown field",
    "42601": "There was a syntax error in a database query",
    "42P01": "A database resource is missing",
    "22001": "One of the inputs is too long",

    // Supabase Auth
    user_already_exists:
      "This email is already registered, please log-in instead",
    invalid_credentials: "Incorrect email or password",
    email_not_confirmed: "Please confirm your email before logging in",
    invalid_email: "The email address is not valid",
    invalid_password: "Password doesn't meet the security requirements",
    token_expired: "Your confirmation link has expired. Please try again",
    user_not_found: "No account found with this email",
    unauthorized: "You are not authorized to perform this action",
    user_update_failed: "We couldn't update your profile. Please try again",

    // Storage / API
    "Bucket not found": "The requested storage bucket was not found",
    "File not found": "The file you're trying to access doesn't exist",
    "Upload failed": "File upload failed. Please try again",
    FetchError: "Unable to connect to the server. Check your connection",
  };

  const m = messages[error.code];

  return m
    ? `${m} <sub/>Code: ${error.code}`
    : `We encountered an unexpected error <sub/>Code: ${error.code}`;
}

export function extractTextInBrackets(str: string) {
  const reg = /\(([^)]+)\)/g;

  const text = str.match(reg)?.toString() ?? "";

  return text.slice(1, text.length - 1);
}

type T_TestResultsRetType =
  Haivy.DBFunc<"get_all_tests_for_authenticated_user">["Returns"];

export function groupTestResultsByAppointments(tests: T_TestResultsRetType) {
  const appts: Record<
    string,
    Haivy.Appointment & {
      tests: T_TestResultsRetType;
    }
  > = {};

  for (const test of tests) {
    if (appts[test.appointment.appointment_id]) {
      continue;
    }

    appts[test.appointment.appointment_id] = {
      ...test.appointment,
      tests: tests.filter(
        (q) => q.appointment.appointment_id === test.appointment.appointment_id
      ),
    };
  }

  return appts;
}
