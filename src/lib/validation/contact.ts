import { z } from "zod";

export const SERVICE_OPTIONS = [
  "Branding",
  "Product",
  "Website",
  "Development",
  "Launch Videos",
] as const;

const MAX_SHORT = 100;
const MAX_LONG = 5000;

// `error` covers missing/wrong-type input; `min` covers an empty string. Both must be friendly:
// these messages are rendered straight into the form.
const requiredText = (missing: string, max: number, tooLong: string) =>
  z.string({ error: missing }).trim().min(1, missing).max(max, tooLong);

export const contactStepOneSchema = z.object({
  name: requiredText("Please enter your name.", MAX_SHORT, "That name is too long."),
  company: requiredText("Please enter your company.", MAX_SHORT, "That company name is too long."),
  email: z.email("Please enter a valid email address.").max(254, "That email address is too long."),
});

export const contactStepTwoSchema = z.object({
  services: z
    .array(z.enum(SERVICE_OPTIONS), { error: "Please select at least one service." })
    .min(1, "Please select at least one service.")
    .max(SERVICE_OPTIONS.length),
  startDate: z
    .string({ error: "Please choose your ideal start date." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose your ideal start date.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Please choose a valid date.")
    .refine((value) => {
      const today = new Date();
      const startOfToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

      return Date.parse(`${value}T00:00:00Z`) >= startOfToday;
    }, "Please choose a date that isn't in the past."),
  challenges: requiredText(
    "Please tell us what you need help with.",
    MAX_LONG,
    "Please shorten this a little.",
  ),
  outcome: z
    .string({ error: "Please shorten this a little." })
    .trim()
    .max(MAX_LONG, "Please shorten this a little."),
});

export const contactFormSchema = contactStepOneSchema.extend(contactStepTwoSchema.shape);

export const contactSubmissionSchema = contactFormSchema.extend({
  turnstileToken: z
    .string({ error: "Please complete the verification and try again." })
    .min(1, "Please complete the verification and try again."),
  // Honeypot: invisible to people, so anything here is a bot. Deliberately permissive — the route
  // accepts it silently instead of failing validation, which would tell the bot what tripped it.
  website: z.string().optional(),
});

export type ContactService = (typeof SERVICE_OPTIONS)[number];
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export const STEP_ONE_FIELDS = ["name", "company", "email"] as const;

export const toFieldErrors = (error: z.ZodError): ContactFieldErrors => {
  const fieldErrors: ContactFieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      fieldErrors[key as keyof ContactFormValues] = issue.message;
    }
  }

  return fieldErrors;
};

// Paths only — issue values contain the submitted PII.
export const toIssuePaths = (error: z.ZodError): string[] =>
  error.issues.map((issue) => issue.path.join("."));
