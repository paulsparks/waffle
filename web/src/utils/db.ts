import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "kysely-codegen/dist";

export const pgConnectionString = `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432`;

export const pgPool = new Pool({
    connectionString: pgConnectionString,
});

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: pgPool,
    }),
});
