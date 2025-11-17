export interface PostListProps {
    posts: { id: string; username: string; text: string }[];
    className?: string;
}

export function PostList({ posts, className }: PostListProps) {
    return (
        <div className={className}>
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="flex flex-col p-4 gap-2 border-b border-overlay-white"
                >
                    <div className="flex justify-start p-1">
                        <h5>@{post.username}</h5>
                    </div>
                    <p className="ml-4 whitespace-pre-wrap">{post.text}</p>
                </div>
            ))}
        </div>
    );
}
