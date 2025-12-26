"use client";

import { PostList } from "@/src/components/PostList";
import { usePosts } from "@/src/hooks/usePosts";
import { useUserInfo } from "@/src/hooks/useUserInfo";
import { authClient } from "@/src/utils/auth-client";
import { ActionIcon, Skeleton } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export interface ProfileProps {
    userId?: string;
}

export function Profile({ userId }: Readonly<ProfileProps>) {
    const router = useRouter();
    const postData = usePosts(userId);
    const { user } = useUserInfo(userId);
    const { data } = authClient.useSession();

    return (
        <div className="flex flex-col h-full items-center gap-4 pt-10">
            {/* NOTE: The "user &&" part of this is just to make the settings load at the same time as the rest */}
            {user && data?.user.id === userId && (
                <div className="flex items-center justify-end w-full px-10">
                    <ActionIcon
                        onClick={() => router.push("/profile/settings")}
                    >
                        <IconSettings />
                    </ActionIcon>
                </div>
            )}
            {/* TODO: Make an AsyncData component to just use a loading spinner for each page */}
            <Skeleton
                visible={!user}
                className="flex flex-col items-center w-3xl! mx-auto gap-10"
            >
                {user && (
                    <>
                        <div className="flex justify-start w-full">
                            <div className="flex-1">
                                <h3>{user.name}</h3>
                                <p className="font-bold">@{user.username}</p>
                                <p className="text-sm">
                                    {user.bio ?? "No bio"}
                                </p>
                            </div>
                            <div className="flex-2"></div>
                        </div>
                        <PostList {...postData} className="w-full" />
                    </>
                )}
            </Skeleton>
        </div>
    );
}
