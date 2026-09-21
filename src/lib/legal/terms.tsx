import Link from "next/link";
import type { ILegalSection } from "@/components/legal/LegalPage";
import { LegalContact } from "@/lib/legal/contact";

export const TERMS_INTRO =
  "These terms cover your use of opencoregroup.com. Work we do for clients is governed by the agreement signed for that project, not by this page.";

export const TERMS_SECTIONS: ILegalSection[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of terms",
    body: (
      <p>
        Welcome to OpenCore Group. By accessing and using our website, you agree to comply with
        these Terms of Use and all applicable laws and regulations. If you do not agree with any
        part of these terms, please do not use our website.
      </p>
    ),
  },
  {
    id: "use-of-the-website",
    title: "Use of the website",
    body: (
      <>
        <p>
          You agree to use the website only for lawful purposes and in a manner that does not
          infringe upon the rights of others. You shall not:
        </p>
        <ul>
          <li>
            Engage in any unauthorized access, use, or modification of the website&rsquo;s content.
          </li>
          <li>Use the website to distribute malicious software, spam, or any harmful material.</li>
          <li>Interfere with the operation of the website or its associated services.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <p>
          All content, trademarks, logos, and other intellectual property on this website are the
          property of OpenCore Group or its licensors. You may not reproduce, distribute, or create
          derivative works without our explicit consent, except as set out under &ldquo;Free
          resources&rdquo; below.
        </p>
        <p>
          Client names, logos and product screenshots shown in our work and testimonials belong to
          their respective owners.
        </p>
      </>
    ),
  },
  {
    id: "free-resources",
    title: "Free resources",
    body: (
      <p>
        The components, files and templates on our <Link href="/resources">Resources</Link> page are
        offered free of charge. Each one is provided under the licence shown with it, and that
        licence governs how you may use it. Resources are provided &ldquo;as is&rdquo;, without
        support or warranty.
      </p>
    ),
  },
  {
    id: "information-you-submit",
    title: "Information you submit",
    body: (
      <p>
        When you send us a message, a project brief or a booking, we use it to respond to you and to
        discuss working together, as described in our <Link href="/privacy">Privacy Policy</Link>.
        You are responsible for what you submit and must ensure it does not violate any laws or the
        rights of third parties. Please do not send confidential information until we have an
        agreement in place that covers it.
      </p>
    ),
  },
  {
    id: "privacy-policy",
    title: "Privacy policy",
    body: (
      <p>
        Your use of the website is also governed by our <Link href="/privacy">Privacy Policy</Link>,
        which outlines how we collect, use, and protect your personal information.
      </p>
    ),
  },
  {
    id: "disclaimers-and-limitation-of-liability",
    title: "Disclaimers and limitation of liability",
    body: (
      <ul>
        <li>
          Our website and its content are provided &ldquo;as is&rdquo; without warranties of any
          kind.
        </li>
        <li>
          We do not guarantee the accuracy, completeness, or reliability of information on the
          website. Case studies describe results achieved for specific clients and are not a
          guarantee of future results.
        </li>
        <li>
          To the fullest extent permitted by law, OpenCore Group is not responsible for any direct,
          indirect, incidental, or consequential damages resulting from your use of the website.
        </li>
      </ul>
    ),
  },
  {
    id: "third-party-links-and-services",
    title: "Third-party links and services",
    body: (
      <p>
        Our website contains links to third-party websites and uses third-party services, such as
        the Cal.com scheduler and WhatsApp. OpenCore Group does not endorse or control these sites
        and services and is not responsible for their content or policies. Your use of them is
        governed by their own terms.
      </p>
    ),
  },
  {
    id: "modification-of-terms",
    title: "Modification of terms",
    body: (
      <p>
        We reserve the right to update or modify these Terms of Use at any time. Any changes will be
        posted on this page with an updated effective date. Continued use of the website constitutes
        acceptance of the revised terms.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    body: (
      <p>
        We reserve the right to restrict or terminate your access to the website at our sole
        discretion, without notice, if we believe you have violated these terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <p>
        These Terms of Use are governed by the laws of the Province of Ontario and the federal laws
        of Canada applicable therein, and any disputes arising from these terms shall be subject to
        the exclusive jurisdiction of the courts of Ontario.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "Contact us",
    body: (
      <>
        <p>If you have any questions regarding these Terms of Use, please contact us at:</p>
        <LegalContact />
      </>
    ),
  },
];
