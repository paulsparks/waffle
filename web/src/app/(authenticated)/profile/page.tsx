"use client";

import { authClient } from "@/src/utils/auth-client";
import { Button, Skeleton } from "@mantine/core";
import { omit } from "radash";

export default function Profile() {
    const { data } = authClient.useSession();

    return (
        <div className="flex flex-col h-full items-center gap-4">
            <Skeleton
                visible={!data?.user}
                className="flex flex-col items-center w-sm! mx-auto"
            >
                {data?.user && (
                    <>
                        <h1>Your Profile</h1>
                        {Object.keys(
                            omit(data.user, [
                                "createdAt",
                                "updatedAt",
                                "image",
                                "emailVerified",
                                "displayUsername",
                            ])
                        ).map((key) => (
                            <p key={key}>
                                {key}:{" "}
                                {
                                    data.user[
                                        key as keyof Omit<
                                            typeof data.user,
                                            | "createdAt"
                                            | "updatedAt"
                                            | "image"
                                            | "emailVerified"
                                            | "displayUsername"
                                        >
                                    ]
                                }
                            </p>
                        ))}
                    </>
                )}
            </Skeleton>
            <Button
                onClick={() => {
                    authClient.signOut();
                }}
            >
                Sign out
            </Button>
        </div>
    );
}
