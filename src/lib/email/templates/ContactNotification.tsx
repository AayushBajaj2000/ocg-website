import { Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/lib/email/templates/EmailLayout";
import { emailStyles } from "@/lib/email/theme";
import type { ContactFormValues } from "@/lib/validation/contact";

type Props = {
  values: ContactFormValues;
  submittedAt: string;
  siteUrl: string;
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Section style={emailStyles.row}>
    <Text style={emailStyles.label}>{label}</Text>
    <Text style={emailStyles.value}>{value}</Text>
  </Section>
);

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

export const ContactNotification: React.FC<Props> = ({ values, submittedAt, siteUrl }) => {
  return (
    <EmailLayout
      preview={`New enquiry from ${values.name} at ${values.company}`}
      siteUrl={siteUrl}
      footer={`Sent from the contact form on opencoregroup.com · ${submittedAt}`}
    >
      <Text style={emailStyles.eyebrow}>New enquiry</Text>
      <Text style={emailStyles.heading}>
        {values.name} · {values.company}
      </Text>

      <Field label="Name" value={values.name} />
      <Field label="Company" value={values.company} />

      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Email</Text>
        <Text style={emailStyles.value}>
          <Link href={`mailto:${values.email}`} style={emailStyles.link}>
            {values.email}
          </Link>
        </Text>
      </Section>

      <Field label="Services" value={values.services.join(", ")} />
      <Field label="Ideal start date" value={formatDate(values.startDate)} />
      <Field label="Challenges" value={values.challenges} />
      {values.outcome ? <Field label="Ideal outcome" value={values.outcome} /> : null}

      <Section style={{ paddingTop: "24px" }}>
        <Link href={`mailto:${values.email}`} style={emailStyles.button}>
          Reply to {values.name.split(" ")[0]}
        </Link>
      </Section>
    </EmailLayout>
  );
};
