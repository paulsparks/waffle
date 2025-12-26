import { notifications } from "@mantine/notifications";
import { useState, useCallback, useEffect } from "react";
import { PostWithUser } from "./usePosts";

export function usePost(postId?: string) {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<PostWithUser>();

    const getPost = useCallback(async () => {
        setLoading(true);

        const res = await fetch(`/api/auth/get-post/${postId ?? ""}`, {
            method: "GET",
        });

        if (res.status === 200) {
            const post: PostWithUser = await res.json();
            setPost(post);
        } else {
            notifications.show({
                message: "An unknown error occurred",
                position: "top-right",
            });
        }

        setLoading(false);
    }, [postId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getPost();
    }, [getPost]);

    return { post, loading, refreshPost: getPost };
}
