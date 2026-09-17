import { Section, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/theme";
import type { ContactFormValues } from "@/lib/validation/contact";

type Props = {
  values: ContactFormValues;
  siteUrl: string;
};

export const ContactAutoReply: React.FC<Props> = ({ values, siteUrl }) => {
  return (
    <EmailLayout
      preview="Thanks for reaching out — we'll be in touch within one business day."
      siteUrl={siteUrl}
      footer="OpenCore Group · Toronto, ON, Canada"
    >
      <Text style={emailStyles.eyebrow}>Thanks for reaching out</Text>
      <Text style={emailStyles.heading}>
        We&apos;ve got your message, {values.name.split(" ")[0]}.
      </Text>

      <Text style={emailStyles.paragraph}>
        A senior member of our team reads every enquiry personally. You can expect a reply within
        one business day.
      </Text>

      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>What you told us</Text>
        <Text style={emailStyles.value}>{values.challenges}</Text>
      </Section>

      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Services you&apos;re interested in</Text>
        <Text style={emailStyles.value}>{values.services.join(", ")}</Text>
      </Section>

      <Text style={{ ...emailStyles.paragraph, paddingTop: "24px" }}>
        In the meantime, just reply to this email if anything changes — it reaches us directly.
      </Text>
    </EmailLayout>
  );
};
