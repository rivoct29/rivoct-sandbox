"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuthUser } from "../lib/hooks";

interface Props {
  children: ReactNode;
}

export const RequireAuth = ({ children }: Props) => {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Checking credentials…
      </div>
    );
  }

  return <>{children}</>;
};
