import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { Pool } from "pg";

export const pgConnectionString = `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432`;

export const auth = betterAuth({
    database: new Pool({
        connectionString: pgConnectionString,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [username()],
});
