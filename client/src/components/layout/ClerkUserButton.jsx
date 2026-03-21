import { UserButton } from "@clerk/react";

/**
 * Thin wrapper around Clerk's UserButton.
 * Only rendered when CLERK_ENABLED is true (see AppShell).
 */
export default function ClerkUserButton() {
  return <UserButton afterSignOutUrl="/" />;
}
