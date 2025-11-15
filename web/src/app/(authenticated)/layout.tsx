"use client";

import { authClient } from "@/src/utils/auth-client";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function Layout({ children }: PropsWithChildren) {
    const { data, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !data) {
            return router.push("/sign-in");
        }
    }, [data, isPending, router]);

    return children;
}
