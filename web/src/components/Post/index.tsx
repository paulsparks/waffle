import { useLikePost } from "@/src/hooks/useLikePost";
import { PostWithUser } from "@/src/hooks/usePosts";
import { authClient } from "@/src/utils/auth-client";
import { ActionIcon } from "@mantine/core";
import {
    IconHeart,
    IconHeartFilled,
    IconMessageDots,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export interface PostProps {
    post: PostWithUser;
    onLikeSuccess: () => void;
    disableClick?: boolean;
}

export function Post({ post, onLikeSuccess, disableClick = false }: PostProps) {
    const { data } = authClient.useSession();
    const { likePost } = useLikePost({ onSuccess: onLikeSuccess });
    const router = useRouter();

    return (
        <div
            className={`flex flex-col p-4 gap-2 border-b border-overlay-white ${
                !disableClick ? "cursor-pointer" : ""
            }`}
            onClick={() => !disableClick && router.push(`/post/${post.id}`)}
        >
            <div className="flex p-1">
                <div className="flex-1">
                    <h5
                        className="cursor-pointer w-fit"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/profile/${post.userId}`);
                        }}
                    >
                        @{post.user?.username}
                    </h5>
                </div>
                <div className="flex-1"></div>
                <div className="flex-1"></div>
            </div>
            <p className="ml-4 mb-2! whitespace-pre-wrap">{post.text}</p>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <ActionIcon
                        size="sm"
                        variant="transparent"
                        onClick={(e) => {
                            e.stopPropagation();
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
                <div className="flex items-center gap-1">
                    <ActionIcon
                        size="sm"
                        variant="transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <IconMessageDots />
                    </ActionIcon>
                    0
                </div>
            </div>
        </div>
    );
}
