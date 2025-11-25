"use client";

import { PostList } from "@/src/components/PostList";
import { usePosts } from "@/src/hooks/usePosts";
import { ActionIcon, Button, Modal, Textarea, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconFeatherFilled } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useCallback } from "react";
import z from "zod";

export const createPostSchema = z.object({
    text: z.string().min(1, { error: "Post cannot be empty" }),
});

export type CreatePost = z.infer<typeof createPostSchema>;

export default function Home() {
    const [opened, { open, close }] = useDisclosure(false);
    const { posts, refreshPosts } = usePosts();

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
                refreshPosts();
            } else {
                notifications.show({
                    message: "An unknown error occurred",
                    position: "top-right",
                });
            }
        },
        [close, form, refreshPosts]
    );

    return (
        <div className="flex flex-col h-full items-center">
            <div className="flex w-full">
                <div className="flex-1" />
                <PostList
                    posts={posts}
                    refreshPosts={refreshPosts}
                    className="flex-2"
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
