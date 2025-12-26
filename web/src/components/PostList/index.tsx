import { PostWithUser } from "@/src/hooks/usePosts";
import { Post } from "../Post";

export interface PostListProps {
    posts: PostWithUser[];
    refreshPosts: () => void;
    className?: string;
}

export function PostList({ posts, refreshPosts, className }: PostListProps) {
    return (
        <div className={className}>
            {posts.map((post) => (
                <Post key={post.id} onLikeSuccess={refreshPosts} post={post} />
            ))}
        </div>
    );
}
