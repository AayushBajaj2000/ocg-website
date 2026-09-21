"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { ClientError } from "eve/client";
import { useEveAgent } from "eve/react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import AssistantMessage from "@/components/assistant/AssistantMessage";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { AssistantLogoIcon } from "@/components/icons";
import { ASSISTANT } from "@/lib/constants";

const EASE = [0.22, 1, 0.36, 1] as const;

const ICON_BUTTON =
  "text-black-3 hover:bg-sunken hover:text-black-1 focus-visible:outline-brand-blue grid size-8 cursor-pointer place-items-center transition-colors focus-visible:outline-2";

const GENERIC_ERROR = "Something went wrong on our side. Please try again in a moment.";

// Rejections authored in agent/channels/eve.ts carry visitor-ready copy; anything else doesn't.
const GATE_CODES = new Set(["rate_limited", "message_too_long", "forbidden_origin"]);

const describeError = (error: Error | undefined): string => {
  if (error instanceof ClientError && error.code && GATE_CODES.has(error.code)) {
    try {
      const body = JSON.parse(error.body) as { error?: unknown; message?: unknown };
      const message = body.error ?? body.message;
      if (typeof message === "string" && message) return message;
    } catch {
      // Fall through to the generic message.
    }
  }
  return GENERIC_ERROR;
};

const AssistantPanel: React.FC = () => {
  const { isOpen, close } = useAssistant();
  // A durable eve session: the conversation lives server-side, and this hook streams it in.
  const agent = useEveAgent();
  const [draft, setDraft] = useState("");
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const isBusy = agent.status === "submitted" || agent.status === "streaming";

  const messages = agent.data.messages.flatMap((message) => {
    const content = message.parts
      .flatMap((part) => (part.type === "text" ? [part.text] : []))
      .join("");
    if (message.role !== "user" && message.role !== "assistant") return [];
    return content ? [{ id: message.id, role: message.role, content }] : [];
  });

  // The model has the message but hasn't produced text yet.
  const isWaiting = isBusy && messages.at(-1)?.role !== "assistant";
  const error = agent.status === "error" ? describeError(agent.error) : null;

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Follow the answer as it streams in.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [agent.data.messages, agent.status]);

  const submit = (text: string) => {
    if (!text.trim() || isBusy) return;
    setDraft("");
    void agent.send(text.trim().slice(0, ASSISTANT.maxMessageChars));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(draft);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    // Handled here so it doesn't also reach the OS desktop's own Escape handling.
    event.stopPropagation();
    close();
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit(draft);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <m.aside
            role="dialog"
            aria-label={ASSISTANT.name}
            onKeyDown={onKeyDown}
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="border-hairline bg-page-alt fixed inset-y-0 right-0 z-1100 flex w-full flex-col border-l shadow-[-24px_0_80px_rgb(0_0_0/0.12)] sm:w-105"
          >
            <header className="border-hairline flex h-14 shrink-0 items-center justify-between border-b pr-3 pl-5">
              <p className="font-jetbrains-mono text-black-1 flex items-center gap-2 text-xs tracking-wide uppercase">
                <AssistantLogoIcon className="text-brand-blue size-4.5" />
                {ASSISTANT.name}
              </p>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={agent.reset}
                    className={`${ICON_BUTTON} w-auto px-2 text-xs`}
                  >
                    New chat
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close assistant"
                  className={ICON_BUTTON}
                >
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden
                    className="size-4 fill-none stroke-current stroke-[1.5]"
                  >
                    <path d="M3.5 3.5l9 9m0-9l-9 9" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </header>

            <div
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-6"
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <div className="mt-auto flex flex-col gap-5">
                  <p className="text-black-1 text-2xl font-medium tracking-[-0.03em]">
                    {ASSISTANT.greeting}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {ASSISTANT.starters.map((starter) => (
                      <li key={starter}>
                        <button
                          type="button"
                          onClick={() => submit(starter)}
                          className="text-black-3 hover:text-black-1 focus-visible:outline-brand-blue flex cursor-pointer items-baseline gap-2 py-1.5 text-left text-sm transition-colors focus-visible:outline-2"
                        >
                          <span aria-hidden className="text-neutral-400">
                            ↳
                          </span>
                          {starter}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ol className="flex flex-col gap-5 text-sm leading-relaxed">
                  {messages.map((message) =>
                    message.role === "user" ? (
                      <li
                        key={message.id}
                        className="bg-sunken text-black-1 ml-8 self-end px-3.5 py-2.5 whitespace-pre-wrap"
                      >
                        {message.content}
                      </li>
                    ) : (
                      <li key={message.id} className="text-black-2 mr-4">
                        <AssistantMessage content={message.content} onNavigate={close} />
                      </li>
                    ),
                  )}
                  {isWaiting && (
                    <li className="text-black-3 flex items-center gap-2" aria-label="Thinking">
                      <AssistantLogoIcon
                        className="text-brand-blue size-4.5"
                        starClassName="animate-pulse motion-reduce:animate-none"
                      />
                      Thinking…
                    </li>
                  )}
                </ol>
              )}

              {error && (
                <p
                  role="alert"
                  className="border-hairline text-black-2 mt-5 border bg-white p-3 text-sm"
                >
                  {error}{" "}
                  <Link
                    href={ASSISTANT.fallback.href}
                    onClick={close}
                    className="text-brand-blue underline underline-offset-2"
                  >
                    {ASSISTANT.fallback.label}
                  </Link>
                </p>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={onSubmit} className="border-hairline shrink-0 border-t p-4">
              <div className="border-field-border focus-within:border-brand-blue flex items-end gap-2 border bg-white p-2 transition-colors">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  rows={1}
                  maxLength={ASSISTANT.maxMessageChars}
                  placeholder={ASSISTANT.placeholder}
                  aria-label={ASSISTANT.placeholder}
                  className="text-black-1 field-sizing-content max-h-32 min-h-8 flex-1 resize-none bg-transparent px-1.5 py-1.5 text-sm outline-none placeholder:text-neutral-400"
                />
                {isBusy ? (
                  <button
                    type="button"
                    onClick={() => void agent.cancel()}
                    aria-label="Stop answering"
                    className="bg-black-1 grid size-8 shrink-0 cursor-pointer place-items-center text-white"
                  >
                    <span aria-hidden className="size-2.5 bg-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send"
                    className="bg-brand-blue grid size-8 shrink-0 cursor-pointer place-items-center text-white transition-opacity disabled:cursor-default disabled:opacity-30"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden
                      className="size-4 fill-none stroke-current stroke-[1.6]"
                    >
                      <path
                        d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-neutral-500">
                {ASSISTANT.disclaimer}{" "}
                <Link href="/privacy" onClick={close} className="underline underline-offset-2">
                  Privacy
                </Link>
              </p>
            </form>
          </m.aside>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default AssistantPanel;
