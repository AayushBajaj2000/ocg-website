import "server-only";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { ContactAutoReply } from "@/lib/email/templates/ContactAutoReply";
import { ContactNotification } from "@/lib/email/templates/ContactNotification";
import { getServerEnv, getSiteUrl } from "@/lib/env/server";
import type { ContactFormValues } from "@/lib/validation/contact";

let client: Resend | null = null;

// The Resend constructor throws when no key is available, so build it lazily and cache it for
// connection reuse on a warm Node process.
const getClient = (): Resend => {
  client ??= new Resend(getServerEnv().RESEND_API_KEY);
  return client;
};

export type SendResult = { ok: true } | { ok: false; reason: string };

export const sendContactEmails = async (values: ContactFormValues): Promise<SendResult> => {
  const env = getServerEnv();
  const siteUrl = getSiteUrl();
  const submittedAt = new Date().toISOString();
  const resend = getClient();

  const [notificationHtml, notificationText, replyHtml, replyText] = await Promise.all([
    render(<ContactNotification values={values} submittedAt={submittedAt} siteUrl={siteUrl} />),
    render(<ContactNotification values={values} submittedAt={submittedAt} siteUrl={siteUrl} />, {
      plainText: true,
    }),
    render(<ContactAutoReply values={values} siteUrl={siteUrl} />),
    render(<ContactAutoReply values={values} siteUrl={siteUrl} />, { plainText: true }),
  ]);

  // The notification IS the lead — if it fails, the submission is lost and the request must fail.
  const notification = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_NOTIFICATION_EMAIL,
    replyTo: values.email,
    subject: `New enquiry — ${values.name} (${values.company})`,
    html: notificationHtml,
    text: notificationText,
  });

  if (notification.error) return { ok: false, reason: notification.error.name };

  // The auto-reply is a courtesy: never fail a captured lead because a thank-you bounced.
  const autoReply = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: values.email,
    replyTo: env.CONTACT_NOTIFICATION_EMAIL,
    subject: "Thanks for reaching out to OpenCore Group",
    html: replyHtml,
    text: replyText,
  });

  if (autoReply.error) {
    console.error(
      JSON.stringify({
        scope: "contact",
        event: "auto_reply_failed",
        reason: autoReply.error.name,
      }),
    );
  }

  return { ok: true };
};
