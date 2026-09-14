import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import {
  ChatGPTIcon,
  ClaudeIcon,
  FacebookIcon,
  GeminiIcon,
  GrokIcon,
  InstagramIcon,
  LinkedInIcon,
  PerplexityIcon,
  PlusIcon,
  XIcon,
} from "@/components/icons";
import Section from "@/components/layout/Section";
import { AnimatedIconButton } from "@/components/ui/AnimatedIconButton";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/ui/NavLinks";
import { StripeReveal } from "@/components/ui/StripeReveal";
import {
  IFooterAiFooterLink,
  IFooterHeadingLink,
  IFooterLink,
  IFooterIcons,
  IFooterAiIconName,
  IFooterSocialIconName,
} from "@/types";
import { FOOTER } from "@/lib/constants";
import { CoreSvg, OpenSvg } from "@/components/icons/FooterLogo";
import Image from "next/image";

/** Seconds each footer image stays on screen. */
const FOOTER_IMAGE_INTERVAL = 2;

const icons: IFooterIcons<IFooterAiIconName> = {
  perplexity: <PerplexityIcon />,
  gemini: <GeminiIcon />,
  chatgpt: <ChatGPTIcon />,
  claude: <ClaudeIcon />,
  grok: <GrokIcon />,
};

const socialIcons: IFooterIcons<IFooterSocialIconName> = {
  linkedin: <LinkedInIcon />,
  facebook: <FacebookIcon />,
  instagram: <InstagramIcon />,
  x: <XIcon />,
};

export const FooterHeadingLink: React.FC<IFooterHeadingLink> = ({ label, link }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs tracking-[-2%] text-black/50 uppercase">{label}</span>
      <Link
        href={link?.href!}
        className="text-black-2 text-base tracking-[-2%] underline underline-offset-2"
      >
        {link?.label}
      </Link>
    </div>
  );
};

export const FooterAILinks: React.FC<IFooterAiFooterLink> = ({ title, links }) => {
  return (
    <div className="order-last flex w-full flex-col gap-6 lg:order-first lg:w-auto">
      <StripeReveal
        as="h3"
        className="md:text-hero-mobile text-center text-2xl font-medium text-black lg:text-left"
      >
        {title}
      </StripeReveal>
      <div className="flex items-center justify-center gap-2 lg:justify-start">
        {links &&
          links.map((l, i) => (
            <Button
              href={l.href!}
              variant="book-call"
              className="grid size-12! place-content-center"
              hoverTextColor={`${l.name ? `var(--color-${l.name})` : "#ffffff"}`}
              key={`${l.name}-${i}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {icons[l.name! as IFooterAiIconName]}
            </Button>
          ))}
      </div>
    </div>
  );
};

export const FooterLinks: React.FC<{ links: IFooterLink[] }> = ({ links }) => {
  return (
    <div className="mx-auto grid max-w-108.5 grid-cols-3 gap-x-2 gap-y-4 md:gap-x-8 lg:mx-0">
      {links.map((l, i) => (
        <NavLink key={`${l.label}-${i}`} href={l.href!} className="truncate">
          {l.label}
        </NavLink>
      ))}
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <Section
      as="footer"
      className="bg-sunken"
      container
      containerClassName="border-x lg:pt-22.5 pt-10"
    >
      <div className="border-b-hairline flex w-full flex-wrap items-start justify-between gap-8 border-b pb-8 lg:pb-12">
        <div className="flex flex-col gap-5 md:gap-10">
          <StripeReveal
            as="h2"
            className="md:text-footer-desktop text-footer-mobile max-w-116.5 font-medium tracking-[-2%] text-black"
          >
            Design, build, and scale with one senior team.
          </StripeReveal>
          <div className="flex flex-wrap items-start gap-4 md:gap-16">
            {FOOTER.headingLinks &&
              FOOTER.headingLinks.map((l, i) => (
                <FooterHeadingLink key={`${l.label}-${i}`} {...l} />
              ))}
          </div>
        </div>
        <AnimatedIconButton
          label="Start your new project"
          href="#"
          icon={<PlusIcon className="size-4" />}
        />
      </div>
      <div className="border-b-hairline flex flex-wrap items-center justify-between gap-6 border-b py-8 md:py-12">
        {FOOTER.aiFooterLinks && (
          <FooterAILinks title={FOOTER.aiFooterLinks.title} links={FOOTER.aiFooterLinks.links} />
        )}
        {FOOTER.links && <FooterLinks links={FOOTER.links} />}
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-4 py-8 md:py-12">
        <div className="flex items-center gap-4">
          {FOOTER.footerText &&
            FOOTER.footerText.map((t, i) => (
              <Fragment key={`${t.text}-${i}`}>
                {t.isLink ? (
                  <a
                    href={t.href}
                    className="text-black-3 font-switzer text-sm tracking-[-2%] underline underline-offset-2 md:text-xl"
                  >
                    {t.text}
                  </a>
                ) : (
                  <span className="text-black-3 font-switzer text-sm tracking-[-2%] md:text-xl">
                    {t.text}
                  </span>
                )}
                {i + 1 < FOOTER.footerText?.length! && (
                  <span className="bg-black-3 size-1.5 rounded-full" />
                )}
              </Fragment>
            ))}
        </div>
        <div className="flex w-full items-center gap-2 lg:w-auto">
          {FOOTER.socialLinks &&
            FOOTER.socialLinks.map((l, i) => (
              <Button
                href={l.href!}
                variant="book-call"
                className="grid size-12! place-content-center"
                key={`${l.name}-${i}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialIcons[l.name! as IFooterSocialIconName]}
              </Button>
            ))}
        </div>
        <div className="w-full">
          <p className="text-black-3 text-sm">
            Copyright &copy; {new Date().getFullYear()} OpenCore Group, All rights reserved
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 pb-4 md:gap-7 md:pb-6">
        <OpenSvg />
        {FOOTER.footerImages && FOOTER.footerImages.length > 0 && (
          <div className="hidden aspect-298/177 w-74.5 shrink-0 overflow-hidden lg:block">
            <div
              className="footer-reel flex flex-col"
              style={
                {
                  "--reel-steps": FOOTER.footerImages.length,
                  "--reel-duration": `${FOOTER.footerImages.length * FOOTER_IMAGE_INTERVAL}s`,
                } as CSSProperties
              }
            >
              {FOOTER.footerImages.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={298}
                  height={177}
                  loading="eager"
                  className="aspect-298/177 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}
        <CoreSvg />
      </div>
    </Section>
  );
};

export default Footer;
