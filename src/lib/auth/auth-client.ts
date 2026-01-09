import {createAuthClient} from "better-auth/react";
import {
  inferAdditionalFields,
  twoFactorClient,
  adminClient,
  organizationClient,
} from "better-auth/client/plugins";
import {passkeyClient} from "@better-auth/passkey/client";

import {auth} from "./auth";
import {admin, user, ac} from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/2fa";
      },
    }),
    adminClient({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    organizationClient(),
  ],
});
