"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "@/components/icons";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      title="Sign out"
      aria-label="Sign out"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          await authClient.signOut();
          router.push("/sign-in");
        } catch {
          setPending(false);
        }
      }}
      className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-50"
    >
      <LogOutIcon className="size-[1.1rem]" />
    </button>
  );
}
