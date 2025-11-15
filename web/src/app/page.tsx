"use client";

import { Container, Loader, Text } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";
import { themeColors } from "../utils/theme";
import { useRouter } from "next/navigation";
import { authClient } from "../utils/auth-client";
import { useEffect } from "react";
import { WaffleTextLogo } from "../components/WaffleTextLogo";

export default function Home() {
    const { data, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && data) {
            return router.push("/home");
        }
    }, [data, isPending, router]);

    if (isPending || data) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center h-full text-center">
            <Container size={700}>
                <Text size="40pt">
                    Welcome to <WaffleTextLogo />
                </Text>

                <LinkButton size="md" href="/sign-in">
                    Sign in
                </LinkButton>
            </Container>
        </div>
    );
}
