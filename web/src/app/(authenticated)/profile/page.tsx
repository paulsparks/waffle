"use client";

import { authClient } from "@/src/utils/auth-client";
import { ActionIcon, Skeleton } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { User } from "kysely-codegen";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { data } = authClient.useSession();
    const router = useRouter();

    return (
        <div className="flex flex-col h-full items-center gap-4">
            <div className="flex w-full items-center justify-between px-10">
                <div className="flex-1"></div>
                <h1 className="flex-1 text-center mx-0! mb-0! mt-3!">
                    Your Profile
                </h1>
                <div className="flex-1 flex items-center justify-end">
                    <ActionIcon
                        onClick={() => router.push("/profile/settings")}
                    >
                        <IconSettings />
                    </ActionIcon>
                </div>
            </div>
            {/* TODO: Make an AsyncData component to just use a loading spinner for each page */}
            <Skeleton
                visible={!data?.user}
                className="flex flex-col items-center px-20 lg:px-32 xl:px-72 mx-auto"
            >
                {data?.user && (
                    <div className="flex justify-start w-full">
                        <div className="flex-1">
                            <h3>{data.user.name}</h3>
                            <p className="font-bold">@{data.user.username}</p>
                            <p className="text-sm">
                                {(data.user as unknown as User).bio ?? "No bio"}
                            </p>
                        </div>
                        <div className="flex-2"></div>
                    </div>
                )}
            </Skeleton>
        </div>
    );
}
