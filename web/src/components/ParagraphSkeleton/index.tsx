import { Skeleton } from "@mantine/core";

export function ParagraphSkeleton() {
    return (
        <div className="w-sm flex flex-col gap-4">
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </div>
    );
}
