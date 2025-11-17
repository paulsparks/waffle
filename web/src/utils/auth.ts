import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { db, pgPool } from "./db";
import { emailToUsername } from "./emailToUsername";
import { waffleTables } from "./waffleTables";

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
    plugins: [username(), waffleTables()],
    user: {
        additionalFields: {
            bio: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                async after(user) {
                    if (!user.username) {
                        let generatedUsername = emailToUsername(user.email);

                        let usernameFound = false;
                        let count = 1;
                        while (!usernameFound) {
                            const res = await db
                                .selectFrom("user")
                                .select("username")
                                .where("username", "=", generatedUsername)
                                .executeTakeFirst();

                            const usernameTaken = !!res;

                            if (usernameTaken) {
                                generatedUsername += count;
                                count++;
                            } else {
                                usernameFound = true;
                            }
                        }

                        await db
                            .updateTable("user")
                            .set("username", generatedUsername)
                            .where("id", "=", user.id)
                            .execute();
                    }
                },
            },
        },
    },
});
