"use client";

import { Error } from "@/src/components/Error";
import { authClient } from "@/src/utils/auth-client";
import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import z from "zod";

export const signUpSchema = z
    .object({
        email: z.string().nonempty({ error: "Email is required" }),
        name: z
            .string()
            .nonempty({ error: "Name is required" })
            .max(30, { error: "Name must not exceed 30 characters" }),
        username: z
            .string()
            .min(3, { error: "Username must be at least 3 characters" })
            .max(30, { error: "Username must not exceed 30 characters" }),
        password: z
            .string()
            .min(8, { error: "Password must be at least 8 characters" })
            .max(128, { error: "Password must not exceed 128 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignUp = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const [error, setError] = useState<string>();
    const router = useRouter();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            name: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
        validate: zod4Resolver(signUpSchema),
    });

    const signUp = useCallback(
        async ({ email, username, password, name }: SignUp) => {
            setError(undefined);

            const { data, error } = await authClient.signUp.email({
                email,
                username,
                password,
                name,
                displayUsername: name,
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
                <form onSubmit={form.onSubmit(signUp)} className="*:mt-2">
                    <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="your@email.com"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                    />
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Name"
                        key={form.key("name")}
                        {...form.getInputProps("name")}
                    />
                    <TextInput
                        withAsterisk
                        label="Username"
                        placeholder="Username"
                        key={form.key("username")}
                        {...form.getInputProps("username")}
                    />
                    <TextInput
                        withAsterisk
                        label="Password"
                        placeholder="Password"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                    />
                    <TextInput
                        withAsterisk
                        label="Confirm Password"
                        placeholder="Password"
                        key={form.key("confirmPassword")}
                        {...form.getInputProps("confirmPassword")}
                    />
                    <Button type="submit" className="mt-8!">
                        Submit
                    </Button>
                    {error && <Error msg={error} className="mt-8!" />}
                </form>
            </div>
        </div>
    );
}
