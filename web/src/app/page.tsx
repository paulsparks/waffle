"use client";

import { Container, Loader, Text } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";
import { themeColors } from "../utils/theme";
import { Cal_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { authClient } from "../utils/auth-client";
import { useEffect } from "react";

const knewave = Cal_Sans({
    subsets: ["latin"],
    weight: "400",
});

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
                    Welcome to{" "}
                    <Text
                        component="span"
                        variant="gradient"
                        gradient={{
                            from: themeColors.waffleOrange[4],
                            to: themeColors.waffleLightBrown[9],
                        }}
                        inherit
                        className={knewave.className}
                    >
                        Waffle
                    </Text>
                </Text>

                <LinkButton size="md" href="/sign-in">
                    Sign in
                </LinkButton>
            </Container>
        </div>
    );
}
