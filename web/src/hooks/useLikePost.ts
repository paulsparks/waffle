import { notifications } from "@mantine/notifications";
import { useCallback } from "react";

export function useLikePost({ onSuccess }: { onSuccess?: () => void }) {
    return {
        likePost: useCallback(
            async (postId: string) => {
                const res = await fetch(`/api/auth/like-post`, {
                    method: "POST",
                    body: JSON.stringify({
                        postId,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (res.status === 200) {
                    onSuccess?.();
                } else {
                    notifications.show({
                        message: "An unknown error occurred",
                        position: "top-right",
                    });
                }
            },
            [onSuccess]
        ),
    };
}
