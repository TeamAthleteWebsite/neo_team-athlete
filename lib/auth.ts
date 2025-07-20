import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { resend } from "./resend";

import { notifyCoaches } from "@/src/actions/prospect.actions";
import { getUserById } from "@/src/actions/user.actions";
import { createAuthMiddleware } from "better-auth/api";
import { User } from "../prisma/generated";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "noreply@example.com",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  hooks: {
    onSignUp: async ({ user }: { user: User }) => {
      try {
        await notifyCoaches(user.id);
      } catch (error) {
        console.error(
          "Erreur lors de l'envoi des notifications aux coachs:",
          error,
        );
      }
    },
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.context.session?.user.id) {
        return;
      }

      const user = await getUserById(ctx.context.session?.user.id);
      if (user && !user.isOnboarded) {
        ctx.redirect("/onboarding/gender");
      }
    }),
  },
});
