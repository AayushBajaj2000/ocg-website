"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Variants,
} from "motion/react";
import InputField from "@/components/ui/fields/InputField";
import DatePicker from "@/components/ui/fields/DatePicker";
import { toISODate } from "@/components/ui/fields/DatePicker/dateUtils";
import { AnimatedIconButton } from "@/components/ui/buttons/AnimatedIconButton";
import { ArrowIcon } from "@/components/icons";
import {
  fadeVariants,
  heightTransition,
  progressTransition,
  reducedTransition,
  slideVariants,
} from "@/components/ui/forms/contactFormMotion";
import { useMeasuredHeight } from "@/components/ui/hooks/useMeasuredHeight";
import { useTurnstile } from "@/components/ui/hooks/useTurnstile";
import { clientEnv } from "@/lib/env/client";
import { trackEvent } from "@/lib/analytics/gtag";
import {
  SERVICE_OPTIONS,
  STEP_ONE_FIELDS,
  contactFormSchema,
  contactStepOneSchema,
  toFieldErrors,
  type ContactFieldErrors,
} from "@/lib/validation/contact";
import type { IContactResponse } from "@/types";

const TOTAL_STEPS = 2;

type FormValues = {
  name: string;
  company: string;
  email: string;
  services: string[];
  startDate: Date | null;
  challenges: string;
  outcome: string;
};

type SubmitState = "idle" | "submitting" | "success";

const INITIAL_VALUES: FormValues = {
  name: "",
  company: "",
  email: "",
  services: [],
  startDate: null,
  challenges: "",
  outcome: "",
};

const toPayload = (values: FormValues) => ({
  ...values,
  startDate: values.startDate ? toISODate(values.startDate) : "",
});

const ContactForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");

  const prefersReducedMotion = useReducedMotion();
  const headingId = useId();
  const stepRef = useRef<HTMLDivElement>(null);
  const hasStepped = useRef<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const { ref: contentRef, height: contentHeight } = useMeasuredHeight<HTMLDivElement>();
  const { containerRef: turnstileRef, getToken } = useTurnstile(
    clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );

  const variants: Variants = prefersReducedMotion ? fadeVariants : slideVariants;
  const isSuccess = submitState === "success";

  useEffect(() => {
    if (!hasStepped.current) return;

    stepRef.current?.focus({ preventScroll: true });
  }, [step]);

  const setValue = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => (key in current ? { ...current, [key]: undefined } : current));
  };

  const goToStep = (next: number, nextDirection: number) => {
    hasStepped.current = true;
    setDirection(nextDirection);
    setStep(next);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const payload = toPayload(values);

    if (step === 1) {
      const stepOne = contactStepOneSchema.safeParse(payload);

      if (!stepOne.success) {
        setErrors(toFieldErrors(stepOne.error));
        return;
      }

      goToStep(2, 1);
      return;
    }

    const result = contactFormSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error);
      setErrors(fieldErrors);
      if (STEP_ONE_FIELDS.some((field) => fieldErrors[field])) goToStep(1, -1);
      return;
    }

    setErrors({});
    setFormError("");
    setSubmitState("submitting");
    isSubmittingRef.current = true;

    try {
      const turnstileToken = await getToken();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, turnstileToken, website: honeypot }),
      });

      const body = (await response.json()) as IContactResponse;

      if (body.ok) {
        setSubmitState("success");
        trackEvent("generate_lead", { form: "contact" });
        return;
      }

      setSubmitState("idle");
      setFormError(body.message);

      const fieldErrors = body.fieldErrors;
      if (fieldErrors) {
        setErrors(fieldErrors);
        if (STEP_ONE_FIELDS.some((field) => fieldErrors[field])) goToStep(1, -1);
      }
    } catch {
      setSubmitState("idle");
      setFormError("We couldn't send your message. Please check your connection and try again.");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <form
        onSubmit={onSubmit}
        noValidate
        aria-labelledby={headingId}
        className="border-hairline flex h-full flex-col gap-8 border-y border-l-0 bg-white p-4 md:p-8 lg:border-l"
      >
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-6">
          {!isSuccess && (
            <ol aria-hidden="true" className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                <li key={index} className="h-1 w-full overflow-hidden bg-neutral-100">
                  <m.span
                    initial={false}
                    animate={{ scaleX: step > index ? 1 : 0 }}
                    transition={prefersReducedMotion ? reducedTransition : progressTransition}
                    className="bg-brand-blue block h-full w-full origin-left"
                  />
                </li>
              ))}
            </ol>
          )}

          <p aria-live="polite" className="sr-only">
            {isSuccess ? "Your message has been sent." : `Step ${step} of ${TOTAL_STEPS}`}
          </p>

          {!isSuccess && (
            <div className="h-6">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {step === 1 ? (
                  <m.span
                    key="intro"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex items-center gap-1.75"
                  >
                    <span aria-hidden="true" className="bg-brand-blue size-1.5 rounded" />
                    <span className="font-switzer text-brand-blue text-sm tracking-[-2%] uppercase">
                      Hi there!
                    </span>
                  </m.span>
                ) : (
                  <m.button
                    key="back"
                    type="button"
                    onClick={() => goToStep(1, -1)}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="text-black-3 font-switzer outline-brand-blue focus-visible:outline-brand-blue hover:text-black-1 flex cursor-pointer items-center gap-2 font-medium tracking-[-2%] transition-colors duration-200 motion-reduce:transition-none"
                  >
                    <ArrowIcon className="size-4 rotate-180" />
                    Back
                  </m.button>
                )}
              </AnimatePresence>
            </div>
          )}

          <h3
            id={headingId}
            className="md:text-footer-desktop text-black-1 text-2xl tracking-[-5%]"
          >
            {isSuccess ? "Thanks for reaching out" : "Tell us about yourself"}
          </h3>
        </div>

        <m.div
          initial={false}
          animate={{ height: contentHeight ?? "auto" }}
          transition={prefersReducedMotion ? reducedTransition : heightTransition}
          className="overflow-hidden"
        >
          <div ref={contentRef}>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <m.div
                key={isSuccess ? "success" : step}
                ref={stepRef}
                tabIndex={-1}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="outline-none"
              >
                {isSuccess ? (
                  <div role="status" className="flex flex-col gap-2 py-2">
                    <p className="font-switzer text-brand-blue text-sm tracking-[-2%] uppercase">
                      Message sent
                    </p>
                    <p className="font-switzer text-black-1 text-2xl tracking-[-2%]">
                      Thanks {values.name.split(" ")[0]} — we&apos;ll be in touch within one
                      business day.
                    </p>
                    <p className="font-switzer text-black-3 text-sm">
                      A confirmation is on its way to {values.email}.
                    </p>
                  </div>
                ) : step === 1 ? (
                  <fieldset className="flex flex-col gap-4">
                    <legend className="sr-only">About you</legend>

                    <InputField
                      label="Name"
                      name="name"
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                      value={values.name}
                      error={errors.name}
                      onChange={(event) => setValue("name", event.target.value)}
                    />
                    <InputField
                      label="Company"
                      name="company"
                      placeholder="XYZ"
                      autoComplete="organization"
                      required
                      value={values.company}
                      error={errors.company}
                      onChange={(event) => setValue("company", event.target.value)}
                    />
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      inputMode="email"
                      placeholder="name@mail.com"
                      autoComplete="email"
                      required
                      value={values.email}
                      error={errors.email}
                      onChange={(event) => setValue("email", event.target.value)}
                    />
                  </fieldset>
                ) : (
                  <fieldset className="flex flex-col gap-4">
                    <legend className="sr-only">Your project</legend>

                    <InputField
                      label="What services are you interested in?"
                      name="services"
                      isMultiSelect
                      required
                      options={[...SERVICE_OPTIONS]}
                      selected={values.services}
                      error={errors.services}
                      onSelectedChange={(selected) => setValue("services", selected)}
                    />
                    <DatePicker
                      label="What is your ideal start date?"
                      name="startDate"
                      placeholder="Select from below"
                      required
                      minDate={new Date()}
                      value={values.startDate}
                      error={errors.startDate}
                      onChange={(date) => setValue("startDate", date)}
                    />
                    <InputField
                      label="What challenges are you facing that you mostly need help with?"
                      name="challenges"
                      isTextarea
                      required
                      value={values.challenges}
                      error={errors.challenges}
                      onChange={(event) => setValue("challenges", event.target.value)}
                    />
                    <InputField
                      label="What would be an ideal outcome for you for this call?"
                      name="outcome"
                      isTextarea
                      value={values.outcome}
                      error={errors.outcome}
                      onChange={(event) => setValue("outcome", event.target.value)}
                    />
                  </fieldset>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </m.div>

        <div ref={turnstileRef} className="empty:hidden" />

        {formError && (
          <p role="alert" className="font-switzer text-sm text-red-600">
            {formError}
          </p>
        )}

        {!isSuccess && (
          <AnimatedIconButton
            label={step === 1 ? "Next" : submitState === "submitting" ? "Sending…" : "Send"}
            icon={<ArrowIcon className="size-5" />}
            type="submit"
            disabled={submitState === "submitting"}
            containerClassName="flex-1"
          />
        )}
      </form>
    </LazyMotion>
  );
};

export default ContactForm;
