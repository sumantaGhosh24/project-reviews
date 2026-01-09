import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {nextCookies} from "better-auth/next-js";
import {
  twoFactor,
  admin as adminPlugin,
  createAuthMiddleware,
} from "better-auth/plugins";
import {passkey} from "@better-auth/passkey";
import {polar, checkout, portal, usage} from "@polar-sh/better-auth";

import prisma from "../db";
import {admin, user, ac} from "./permissions";
import {polarClient} from "../polar";
import {sendPasswordResetEmail} from "../email/password-reset-email";
import {sendEmailVerificationEmail} from "../email/email-verification";
import {sendDeleteAccountVerificationEmail} from "../email/delete-account-verification";
import {sendWelcomeEmail} from "../email/welcome-email";

export const auth = betterAuth({
  appName: "Project Reviews",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({user, url}) => {
      await sendPasswordResetEmail({user, url});
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({user, url}) => {
      await sendEmailVerificationEmail({user, url});
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({user, url, newEmail}) => {
        await sendEmailVerificationEmail({
          user: {...user, email: newEmail},
          url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({user, url}) => {
        await sendDeleteAccountVerificationEmail({user, url});
      },
    },
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          favoriteNumber: Number(profile.public_repos) || 0,
        };
      },
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      mapProfileToUser: () => {
        return {
          favoriteNumber: 0,
        };
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "80b07175-850d-48b5-9c56-99ebabd8e427",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
      ],
    }),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };

        if (user != null) {
          await sendWelcomeEmail(user);
        }
      }
    }),
  },
});
