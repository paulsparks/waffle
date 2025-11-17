import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";
import { getSessionFromCtx } from "better-auth/api";
import z from "zod";
import { map } from "radash";

export const createPostSchema = z.object({
    text: z.string(),
});

export type CreatePost = z.infer<typeof createPostSchema>;

export const getUserByIdSchema = z.object({
    id: z.string(),
});

export type GetUserById = z.infer<typeof createPostSchema>;

export const waffleTables = () => {
    return {
        id: "waffle-tables",
        endpoints: {
            createPost: createAuthEndpoint(
                "/create-post",
                {
                    method: "POST",
                },
                async (ctx) => {
                    const body = createPostSchema.safeParse(ctx.body);

                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    if (!body.success) {
                        return ctx.error("BAD_REQUEST");
                    }

                    await db
                        .insertInto("posts")
                        .values({
                            id: uuidv4(),
                            userId: session.user.id,
                            text: body.data.text.trim(),
                            createdAt: new Date(),
                            likes: 0,
                            reposts: 0,
                        })
                        .execute();
                }
            ),
            getPosts: createAuthEndpoint(
                "/get-posts",
                {
                    method: "GET",
                },
                async (ctx) => {
                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    const posts = await db
                        .selectFrom("posts")
                        .selectAll()
                        .execute();

                    const postsWithUser = await map(posts, async (post) => ({
                        ...post,
                        user: await db
                            .selectFrom("user")
                            .select(["name", "username"])
                            .where("id", "=", post.userId)
                            .executeTakeFirst(),
                    }));

                    return postsWithUser;
                }
            ),
            getPostsByUser: createAuthEndpoint(
                "/get-posts/:userId",
                {
                    method: "GET",
                },
                async (ctx) => {
                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    return db
                        .selectFrom("posts")
                        .where("userId", "=", ctx.params.userId)
                        .selectAll()
                        .execute();
                }
            ),
        },
        schema: {
            posts: {
                fields: {
                    userId: {
                        type: "string",
                        required: true,
                        references: {
                            model: "user",
                            field: "id",
                            // TODO: Create a field to mark a post as hidden when its user is deleted.
                            onDelete: "no action",
                        },
                    },
                    text: {
                        type: "string",
                        required: true,
                    },
                    createdAt: {
                        type: "date",
                        required: true,
                    },
                    likes: {
                        type: "number",
                        required: true,
                    },
                    reposts: {
                        type: "number",
                        required: true,
                    },
                },
            },
        },
    } satisfies BetterAuthPlugin;
};
