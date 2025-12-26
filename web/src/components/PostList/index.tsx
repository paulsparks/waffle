import { PostWithUser } from "@/src/hooks/usePosts";
import { authClient } from "@/src/utils/auth-client";
import { ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface PostListProps {
    posts: PostWithUser[];
    refreshPosts: () => void;
    className?: string;
}

export function PostList({ posts, refreshPosts, className }: PostListProps) {
    const { data } = authClient.useSession();
    const router = useRouter();

    const likePost = useCallback(
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
                refreshPosts();
            } else {
                notifications.show({
                    message: "An unknown error occurred",
                    position: "top-right",
                });
            }
        },
        [refreshPosts]
    );

    return (
        <div className={className}>
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="flex flex-col p-4 gap-2 border-b border-overlay-white"
                >
                    <div className="flex p-1">
                        <div className="flex-1">
                            <h5
                                className="cursor-pointer w-fit"
                                onClick={() =>
                                    router.push(`/profile/${post.userId}`)
                                }
                            >
                                @{post.user?.username}
                            </h5>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex-1"></div>
                    </div>
                    <p className="ml-4 mb-2! whitespace-pre-wrap">
                        {post.text}
                    </p>
                    <div className="flex items-center gap-1">
                        <ActionIcon
                            size="sm"
                            variant="transparent"
                            onClick={() => {
                                likePost(post.id);
                            }}
                        >
                            {post.likes.some((x) => x === data?.user.id) ? (
                                <IconHeartFilled color="red" />
                            ) : (
                                <IconHeart />
                            )}
                        </ActionIcon>
                        {post.likes.length}
                    </div>
                </div>
            ))}
        </div>
    );
}
