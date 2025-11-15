import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { db, pgPool } from "./db";
import { emailToUsername } from "./emailToUsername";

export const auth = betterAuth({
    database: pgPool,
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [username()],
    databaseHooks: {
        user: {
            create: {
                async after(user) {
                    // TODO: Add a check for emailToUsername output already existing
                    if (!user.username) {
                        await db
                            .updateTable("user")
                            .set("username", emailToUsername(user.email))
                            .where("id", "=", user.id)
                            .execute();
                    }
                },
            },
        },
    },
});
