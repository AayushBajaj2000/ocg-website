"use client";

import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query/getQueryClient";

type Props = {
  children: ReactNode;
};

const QueryProvider: React.FC<Props> = ({ children }) => (
  <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
);

export default QueryProvider;
