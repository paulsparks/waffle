"use client";

import { Container, Text } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";

export default function Home() {
    return (
        <div className="flex flex-col justify-center h-full text-center">
            <Container size={700}>
                <Text size="40pt">
                    Welcome to{" "}
                    <Text
                        component="span"
                        variant="gradient"
                        gradient={{ from: "orange", to: "yellow" }}
                        inherit
                    >
                        Waffle
                    </Text>
                    !
                </Text>

                <LinkButton size="md" href="/sign-in">
                    Sign in
                </LinkButton>
            </Container>
        </div>
    );
}
