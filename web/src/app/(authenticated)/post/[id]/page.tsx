import PostPageContents from "./post";

export default async function PostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <PostPageContents postId={id} />;
}
