"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import AssistantLauncher from "@/components/assistant/AssistantLauncher";

type AssistantContext = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const Context = createContext<AssistantContext | null>(null);

export const useAssistant = (): AssistantContext => {
  const value = use(Context);
  if (!value) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return value;
};

// The panel (and the chat code behind it) loads the first time someone opens it, so the
// assistant costs the pages nothing until it is used.
const AssistantPanel = dynamic(() => import("@/components/assistant/AssistantPanel"), {
  ssr: false,
});

export const AssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const open = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setHasOpened(true);
    setIsOpen((prev) => !prev);
  }, []);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return (
    <Context value={value}>
      {children}
      <AssistantLauncher />
      {/* Stays mounted once opened, so closing the panel doesn't lose the conversation. */}
      {hasOpened && <AssistantPanel />}
    </Context>
  );
};
