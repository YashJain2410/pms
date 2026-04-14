"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useSessionStore } from "@/store/useSessionStore";
import { QueryProvider } from "@/components/providers/query-provider";
import { DashboardSkeleton } from "@/components/ui/skeletons";

const AIChatWidget = dynamic(
  () => import("@/components/ai/AIChatWidget").then((mod) => mod.AIChatWidget),
  { ssr: false },
);

export function AppProviders({ children }: { children: React.ReactNode }) {
  useAuthBootstrap();
  const user = useSessionStore((state) => state.user);
  const isAuthLoading = useSessionStore((state) => state.isAuthLoading);
  const [showAIWidget, setShowAIWidget] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowAIWidget(false);
      return;
    }

    let cancelled = false;
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const reveal = () => {
      if (!cancelled) {
        setShowAIWidget(true);
      }
    };

    const idleHandle = win.requestIdleCallback?.(reveal, { timeout: 1500 });
    const timeoutHandle = idleHandle == null ? window.setTimeout(reveal, 1200) : null;

    return () => {
      cancelled = true;
      if (idleHandle != null) {
        win.cancelIdleCallback?.(idleHandle);
      }
      if (timeoutHandle != null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [user]);

  if (isAuthLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <QueryProvider>
      {children}
      {user && showAIWidget ? <AIChatWidget /> : null}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
