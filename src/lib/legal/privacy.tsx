import Link from "next/link";
import CookiePreferencesButton from "@/components/analytics/CookiePreferencesButton";
import type { ILegalSection } from "@/components/legal/LegalPage";
import { LegalContact } from "@/lib/legal/contact";

export const PRIVACY_INTRO =
  "Your privacy is important to us. This policy explains what OpenCore Group collects when you visit opencoregroup.com, why, who helps us process it, and the choices you have.";

// Keep this in step with what the site actually does: the contact form's fields
// (`src/lib/validation/contact.ts`), the analytics loader (`src/components/analytics`), and the
// third-party services named under "Sharing of information".
export const PRIVACY_SECTIONS: ILegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <p>
        Welcome to OpenCore Group (&ldquo;OpenCore&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We
        are committed to protecting the personal information you share with us. This Privacy Policy
        outlines how we collect, use, disclose, and safeguard your information when you visit our
        website.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Information you give us.</strong> When you use our contact form: your name,
            company, email address, the services you are interested in, your target start date, and
            what you tell us about your project. When you book a call: your name, email address and
            anything you add to the booking. When you email, phone or message us: the contents of
            that conversation.
          </li>
          <li>
            <strong>Technical information.</strong> IP address, browser type, operating system and
            similar data that any web server receives. We also use your IP address to limit repeated
            form submissions and keep the contact form free of abuse.
          </li>
          <li>
            <strong>Usage data.</strong> If you accept analytics cookies, information about how you
            use the site, such as pages visited, time spent, the site you came from and your
            approximate location. We also collect page-speed measurements that use no cookies and do
            not identify you.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-your-information",
    title: "How we use your information",
    body: (
      <>
        <p>We use the information collected to:</p>
        <ul>
          <li>Provide, operate, and maintain our website and services.</li>
          <li>Respond to your enquiries, schedule calls and send information you asked for.</li>
          <li>Improve user experience and enhance website functionality.</li>
          <li>Ensure security and detect spam, fraud or unauthorized access.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p>We do not use your information for advertising.</p>
      </>
    ),
  },
  {
    id: "sharing-of-information",
    title: "Sharing of information",
    body: (
      <>
        <p>We do not sell or rent your personal information. We share it only with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> that help us run the site: Vercel (hosting and
            page-speed measurement), Google Analytics (usage analytics, only if you accept cookies),
            Cloudflare Turnstile (spam protection on the contact form), Resend (delivering contact
            form messages by email), Cal.com (scheduling calls) and Sanity (delivering the
            site&rsquo;s content and images). If you choose to message us on WhatsApp, that
            conversation is handled by WhatsApp.
          </li>
          <li>
            <strong>Legal authorities,</strong> when required by law, regulation, or legal process.
          </li>
          <li>
            <strong>Business transfers,</strong> in the event of a merger, acquisition, or sale of
            assets.
          </li>
        </ul>
        <p>
          Some of these providers process information outside Canada, including in the United
          States, where it is subject to the laws of that jurisdiction.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking technologies",
    body: (
      <>
        <p>
          We only set analytics cookies if you choose &ldquo;Accept&rdquo; on the cookie notice.
          Until then, Google Analytics is not loaded at all. If you decline, the site works exactly
          the same. You can change your mind at any time:{" "}
          <CookiePreferencesButton className="text-brand-blue cursor-pointer underline underline-offset-4 hover:no-underline" />
          .
        </p>
        <ul>
          <li>
            <strong>Analytics (optional).</strong> Google Analytics cookies such as <code>_ga</code>
            , used to understand how the site is used. We do not use advertising cookies.
          </li>
          <li>
            <strong>Your cookie choice.</strong> Saved in your browser&rsquo;s local storage so we
            don&rsquo;t ask on every page.
          </li>
          <li>
            <strong>Security and booking.</strong> Cloudflare Turnstile on the contact form and the
            Cal.com scheduler on the booking page may store what they need to work and to tell
            people from bots.
          </li>
        </ul>
        <p>You can also block or delete cookies through your browser settings.</p>
      </>
    ),
  },
  {
    id: "data-security-and-retention",
    title: "Data security and retention",
    body: (
      <>
        <p>
          We implement industry-standard security measures to protect your data. However, no method
          of transmission over the internet is completely secure.
        </p>
        <p>
          We keep enquiry and booking information for as long as we need it to respond to you and to
          maintain our business records, and delete it when it is no longer needed.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>Depending on your location, you may have rights to:</p>
        <ul>
          <li>Access, correct, or delete your personal information.</li>
          <li>Withdraw consent for data processing, including analytics cookies.</li>
          <li>Opt out of marketing communications.</li>
          <li>Ask us how your information has been used and who it has been shared with.</li>
        </ul>
        <p>
          To exercise any of these, email{" "}
          <a href="mailto:info@opencoregroup.com">info@opencoregroup.com</a>. If you are in Canada
          and are not satisfied with our response, you can contact the Office of the Privacy
          Commissioner of Canada.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-party links",
    body: (
      <p>
        Our website contains links to third-party sites, including client websites, social networks
        and AI assistants. We are not responsible for their privacy practices and encourage you to
        review their policies.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page
        with an updated effective date. Your use of the website is also governed by our{" "}
        <Link href="/terms">Terms of Use</Link>.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "Contact us",
    body: (
      <>
        <p>
          If you have any questions or concerns regarding this Privacy Policy, please contact us at:
        </p>
        <LegalContact />
      </>
    ),
  },
];
