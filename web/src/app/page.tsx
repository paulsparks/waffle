"use client";

import { Container, Text } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";
import { themeColors } from "../utils/theme";
import { Cal_Sans } from "next/font/google";

const knewave = Cal_Sans({
    subsets: ["latin"],
    weight: "400",
});

export default function Home() {
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
