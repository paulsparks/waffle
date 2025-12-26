"use client";
import { Post } from "@/src/components/Post";
import { usePost } from "@/src/hooks/usePost";
import { Loader } from "@mantine/core";
import { notFound } from "next/navigation";

export default function PostPageContents({ postId }: { postId: string }) {
    const { post, refreshPost, loading } = usePost(postId);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader />
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="flex justify-center mt-20!">
            <div className="flex-1" />
            <div className="flex-2">
                <Post onLikeSuccess={refreshPost} post={post} disableClick />
            </div>
            <div className="flex-1" />
        </div>
    );
}
