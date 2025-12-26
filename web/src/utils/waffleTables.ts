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

export const postIdSchema = z.object({
    postId: z.string(),
});

export const getUserByIdSchema = z.object({
    id: z.string(),
});

export type GetUserById = z.infer<typeof createPostSchema>;

export const waffleTables = () => {
    return {
        id: "waffle-tables",
        endpoints: {
            likePost: createAuthEndpoint(
                "/like-post",
                {
                    method: "POST",
                },
                async (ctx) => {
                    const body = postIdSchema.safeParse(ctx.body);

                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    if (!body.success) {
                        return ctx.error("BAD_REQUEST");
                    }

                    const likesRaw = await db
                        .selectFrom("posts")
                        .select("likes")
                        .where("id", "=", body.data.postId)
                        .executeTakeFirst();

                    // TODO: Figure out why this thinks it's a string
                    const likes = likesRaw?.likes as unknown as string[];

                    // TODO: Do this via the DB instead of querying unnecessary data
                    if (likes.some((x) => x === session.user.id)) {
                        const index = likes.indexOf(session.user.id);
                        if (index > -1) {
                            likes.splice(index, 1);
                        }
                    } else {
                        likes.push(session.user.id);
                    }

                    await db
                        .updateTable("posts")
                        .set("likes", JSON.stringify(likes))
                        .where("id", "=", body.data.postId)
                        .execute();
                }
            ),
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
                            likes: "[]",
                            reposts: 0,
                        })
                        .execute();
                }
            ),
            deletePost: createAuthEndpoint(
                "/delete-post",
                {
                    method: "POST",
                },
                async (ctx) => {
                    const body = postIdSchema.safeParse(ctx.body);

                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    if (!body.success) {
                        return ctx.error("BAD_REQUEST");
                    }

                    const ownsPost = await db
                        .selectFrom("posts")
                        .select("id")
                        .where("id", "=", body.data.postId)
                        .where("userId", "=", session.user.id)
                        .executeTakeFirst();

                    if (!ownsPost) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    await db
                        .deleteFrom("posts")
                        .where("id", "=", body.data.postId)
                        .execute();
                }
            ),
            getPost: createAuthEndpoint(
                "/get-post/:postId",
                {
                    method: "GET",
                },
                async (ctx) => {
                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    const post = await db
                        .selectFrom("posts")
                        .selectAll()
                        .where("id", "=", ctx.params.postId)
                        .executeTakeFirst();

                    if (!post) {
                        return ctx.error("BAD_REQUEST");
                    }

                    return {
                        ...post,
                        user: await db
                            .selectFrom("user")
                            .select(["name", "username"])
                            .where("id", "=", post.userId)
                            .executeTakeFirst(),
                    };
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
                        .orderBy("createdAt", "desc")
                        .execute();

                    // TODO: This mapping can probably be done way more efficiently with SQL
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

                    const posts = await db
                        .selectFrom("posts")
                        .where("userId", "=", ctx.params.userId)
                        .selectAll()
                        .orderBy("createdAt", "desc")
                        .execute();

                    const user = await db
                        .selectFrom("user")
                        .select(["name", "username"])
                        .where("id", "=", ctx.params.userId)
                        .executeTakeFirst();

                    return posts.map((post) => ({
                        ...post,
                        user: { ...user },
                    }));
                }
            ),
            getCommentsByPost: createAuthEndpoint(
                "/get-comments/:postId",
                {
                    method: "GET",
                },
                async (ctx) => {
                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    // TODO: Find a good way to resolve the user as part of each comment directly in the DB.
                    return await db
                        .selectFrom("comments")
                        .where("postId", "=", ctx.params.postId)
                        .selectAll()
                        .orderBy("createdAt", "desc")
                        .execute();
                }
            ),
            getUser: createAuthEndpoint(
                "/get-user/:userId",
                {
                    method: "GET",
                },
                async (ctx) => {
                    const session = await getSessionFromCtx(ctx);

                    if (!session) {
                        return ctx.error("UNAUTHORIZED");
                    }

                    return await db
                        .selectFrom("user")
                        .select(["id", "bio", "username", "image", "name"])
                        .where("id", "=", ctx.params.userId)
                        .executeTakeFirst();
                }
            ),
        },
        schema: {
            comments: {
                fields: {
                    userId: {
                        type: "string",
                        required: true,
                        references: {
                            model: "user",
                            field: "id",
                            // TODO: Create a field to mark a comment as hidden when its user is deleted.
                            onDelete: "no action",
                        },
                    },
                    postId: {
                        type: "string",
                        required: true,
                        references: {
                            model: "posts",
                            field: "id",
                            // TODO: Create a field to mark a comment as hidden when its post is deleted.
                            onDelete: "no action",
                        },
                    },
                    text: {
                        type: "string",
                        required: true,
                    },
                    // Array of user IDs of those who liked the comment
                    likes: {
                        type: "string[]",
                        required: true,
                    },
                    createdAt: {
                        type: "date",
                        required: true,
                    },
                },
            },
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
                    // Array of user IDs of those who liked the post
                    likes: {
                        type: "string[]",
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
