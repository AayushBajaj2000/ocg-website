import { IDiscoveryCall } from "@/types";

export interface IContactForm {
  name: string;
  company: string;
  email: string;
  desiredServices: string[];
  startDate: string;
  challenges: string;
  outcome?: string;
}

export interface IContact {
  title?: string;
  description?: string;
  discoveryCall?: IDiscoveryCall;
  contactForm?: IContactForm;
}
