import { notifications } from "@mantine/notifications";
import { useState, useCallback, useEffect } from "react";

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
    likes: string[];
    reposts: number;
    userId: string;
};

export function usePosts(userId?: string) {
    const [posts, setPosts] = useState<PostWithUser[]>([]);

    const getPosts = useCallback(async () => {
        const res = await fetch(`/api/auth/get-posts/${userId ?? ""}`, {
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
    }, [userId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getPosts();
    }, [getPosts]);

    return { posts, refreshPosts: getPosts };
}
