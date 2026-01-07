"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

interface UseAdminPermissionOptions {
  redirectTo?: string;
}

export function useAdminPermission(options: UseAdminPermissionOptions = {}) {
  const { redirectTo } = options;
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    authClient.admin
      .hasPermission({ permission: { user: ["list"] } })
      .then(({ data }) => {
        const allowed = data?.success ?? false;
        setIsAdmin(allowed);

        if (!allowed && redirectTo) {
          router.replace(redirectTo);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session, sessionLoading, redirectTo, router]);

  return {
    isAdmin,
    isLoading,
    session,
  };
}
