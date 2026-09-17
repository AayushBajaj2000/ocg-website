import { Metadata } from "next";
import Contact from "@/app/contact/_components/Contact";

export const metadata: Metadata = {
  title: "Contact | OpenCore Group",
  description: "Need a squad on your team? Let's talk!",
};

const ContactPage = () => <Contact />;

export default ContactPage;
