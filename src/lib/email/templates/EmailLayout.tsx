import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { emailStyles } from "@/lib/email/theme";

type Props = {
  preview: string;
  siteUrl: string;
  footer: string;
  children: ReactNode;
};

export const EmailLayout: React.FC<Props> = ({ preview, siteUrl, footer, children }) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            {/* Styles apply to the alt text too, so a blocked or missing image still reads as the
                brand rather than a broken-image icon. */}
            <Img
              src={`${siteUrl}/email/opencore-logo.png`}
              alt="OpenCore Group"
              width="192"
              height="32"
              style={emailStyles.logo}
            />
            <Hr style={emailStyles.accent} />
          </Section>
          <Section style={emailStyles.content}>{children}</Section>
          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>{footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
