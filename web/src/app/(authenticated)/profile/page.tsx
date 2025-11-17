"use client";

import { PostList } from "@/src/components/Post";
import { authClient } from "@/src/utils/auth-client";
import { ActionIcon, Skeleton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSettings } from "@tabler/icons-react";
import { Posts as Post, User } from "kysely-codegen";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Profile() {
    const { data } = authClient.useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);

    const getPosts = useCallback(async (userId: string) => {
        const res = await fetch(`/api/auth/get-posts/${userId}`, {
            method: "GET",
        });

        if (res.status === 200) {
            const posts: Post[] = await res.json();
            setPosts(posts);
        } else {
            notifications.show({
                message: "An unknown error occurred",
                position: "top-right",
            });
        }
    }, []);

    useEffect(() => {
        if (data?.user.id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            getPosts(data.user.id);
        }
    }, [data?.user.id, getPosts]);

    return (
        <div className="flex flex-col h-full items-center gap-4 pt-10">
            <div className="flex w-full items-center justify-between px-10">
                <div className="flex-1"></div>
                <h1 className="flex-1 text-center mx-0! mb-0! mt-3!">
                    Your Profile
                </h1>
                <div className="flex-1 flex items-center justify-end">
                    <ActionIcon
                        onClick={() => router.push("/profile/settings")}
                    >
                        <IconSettings />
                    </ActionIcon>
                </div>
            </div>
            {/* TODO: Make an AsyncData component to just use a loading spinner for each page */}
            <Skeleton
                visible={!data?.user}
                className="flex flex-col items-center w-3xl! mx-auto gap-10"
            >
                {data?.user && (
                    <>
                        <div className="flex justify-start w-full">
                            <div className="flex-1">
                                <h3>{data.user.name}</h3>
                                <p className="font-bold">
                                    @{data.user.username}
                                </p>
                                <p className="text-sm">
                                    {(data.user as unknown as User).bio ??
                                        "No bio"}
                                </p>
                            </div>
                            <div className="flex-2"></div>
                        </div>
                        <PostList
                            className="w-full"
                            posts={posts.map((p) => ({
                                id: p.id,
                                text: p.text,
                                username: data.user.username ?? "",
                            }))}
                        />
                    </>
                )}
            </Skeleton>
        </div>
    );
}
