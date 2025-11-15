"use client";

import { authClient } from "@/src/utils/auth-client";
import { Button, Skeleton } from "@mantine/core";

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
                        <p>Hello {data.user.name}!</p>
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
