"use client";

import { Error } from "@/src/components/Error";
import { authClient } from "@/src/utils/auth-client";
import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import z from "zod";
import { signUpSchema } from "../sign-up/page";
import Link from "next/link";

export const signInSchema = signUpSchema.pick({
    username: true,
    password: true,
});

export type SignIn = z.infer<typeof signInSchema>;

export default function SignIn() {
    const [error, setError] = useState<string>();
    const router = useRouter();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            password: "",
        },
        validate: zod4Resolver(signInSchema),
    });

    const signIn = useCallback(
        async ({ username, password }: SignIn) => {
            setError(undefined);

            console.log("sign-in");
            const { data, error } = await authClient.signIn.username({
                username,
                password,
            });

            setError(error?.message);

            if (data) {
                router.push("/home");
            }
        },
        [router]
    );

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-md">
                <Text size="20pt" className="text-center">
                    Sign in
                </Text>
                <form onSubmit={form.onSubmit(signIn)} className="*:mt-2">
                    <TextInput
                        withAsterisk
                        label="Username"
                        placeholder="Username"
                        key={form.key("username")}
                        {...form.getInputProps("username")}
                    />
                    <PasswordInput
                        withAsterisk
                        label="Password"
                        placeholder="Password"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                    />
                    <div className="mt-6! flex flex-col items-center gap-4">
                        <Button type="submit">Sign in</Button>
                        <Text>
                            Don&apos;t have an account?{" "}
                            <Link href="/sign-up">Create a new one.</Link>
                        </Text>
                    </div>
                    {error && <Error msg={error} className="mt-8!" />}
                </form>
            </div>
        </div>
    );
}
