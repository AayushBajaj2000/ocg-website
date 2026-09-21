// Contact block shared by both legal pages, so the details can't drift apart again (the PDFs these
// replaced printed one phone number in the body and a different one in the page footer).
export const LEGAL_EFFECTIVE_DATE = "2026-09-21";

export const LegalContact: React.FC = () => (
  <address className="text-black-2 not-italic">
    <strong>OpenCore Group</strong>
    <br />
    679 Wagg Rd, Uxbridge, ON, Canada L9P 0P5
    <br />
    Email: <a href="mailto:info@opencoregroup.com">info@opencoregroup.com</a>
    <br />
    Phone: <a href="tel:+16474932673">(647) 493-2673</a>
  </address>
);
