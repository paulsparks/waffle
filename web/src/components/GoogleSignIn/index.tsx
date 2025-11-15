import { authClient } from "@/src/utils/auth-client";
import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useCallback } from "react";

export interface GoogleSignInProps {
    onError?: (error: string) => void;
}

export function GoogleSignIn({ onError }: GoogleSignInProps) {
    const signIn = useCallback(async () => {
        const { error } = await authClient.signIn.social({
            provider: "google",
        });

        if (error) {
            onError?.(
                error.message ?? "An error occurred while signing into Google."
            );
        }
    }, [onError]);

    return (
        <Button
            leftSection={<IconBrandGoogle />}
            variant="light"
            onClick={signIn}
        >
            Continue with Google
        </Button>
    );
}
