"use client";

import { PostList } from "@/src/components/Post";
import { ActionIcon, Button, Modal, Textarea, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconFeatherFilled } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useCallback, useEffect, useState } from "react";
import z from "zod";

export const createPostSchema = z.object({
    text: z.string().min(1, { error: "Post cannot be empty" }),
});

export type CreatePost = z.infer<typeof createPostSchema>;

// NOTE: This comes from waffleTables.ts
export type PostWithUser = {
    user:
        | {
              name: string;
              username: string | null;
          }
        | undefined;
    text: string;
    id: string;
    createdAt: Date;
    likes: number;
    reposts: number;
    userId: string;
};

export default function Home() {
    const [opened, { open, close }] = useDisclosure(false);
    const [posts, setPosts] = useState<PostWithUser[]>([]);

    const getPosts = useCallback(async () => {
        const res = await fetch("/api/auth/get-posts", {
            method: "GET",
        });

        if (res.status === 200) {
            const posts: PostWithUser[] = await res.json();
            setPosts(posts);
        } else {
            notifications.show({
                message: "An unknown error occurred",
                position: "top-right",
            });
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getPosts();
    }, [getPosts]);

    const form = useForm<CreatePost>({
        validate: zod4Resolver(createPostSchema),
        mode: "uncontrolled",
        initialValues: {
            text: "",
        },
    });

    const onSubmit = useCallback(
        async (formData: CreatePost) => {
            const { status } = await fetch("/api/auth/create-post", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (status === 200) {
                close();
                form.reset();
                getPosts();
            } else {
                notifications.show({
                    message: "An unknown error occurred",
                    position: "top-right",
                });
            }
        },
        [close, form, getPosts]
    );

    return (
        <div className="flex flex-col h-full items-center">
            <div className="flex w-full">
                <div className="flex-1" />
                <PostList
                    className="flex-2"
                    posts={posts.map((p) => ({
                        id: p.id,
                        text: p.text,
                        username: p.user?.username ?? "",
                    }))}
                />
                <div className="flex-1" />
            </div>
            <Modal
                opened={opened}
                onClose={close}
                title="New post"
                centered
                closeOnClickOutside={false}
                size="lg"
            >
                <form className="px-10" onSubmit={form.onSubmit(onSubmit)}>
                    <Textarea
                        size="md"
                        autosize
                        minRows={3}
                        maxRows={5}
                        pb="sm"
                        key={form.key("text")}
                        {...form.getInputProps("text")}
                    />
                    <Button className="float-end mb-6" type="submit">
                        Post
                    </Button>
                </form>
            </Modal>
            <Tooltip label="Post">
                <ActionIcon
                    size="xl"
                    variant="light"
                    className="fixed! bottom-10 right-10"
                    onClick={open}
                >
                    <IconFeatherFilled />
                </ActionIcon>
            </Tooltip>
        </div>
    );
}
