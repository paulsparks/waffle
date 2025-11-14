"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import z from "zod";

const signInSchema = z
    .object({
        email: z.string().nonempty(),
        username: z.string().min(3).max(30),
        password: z.string().min(8).max(128),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function SignIn() {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
        validate: zod4Resolver(signInSchema),
    });

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-md">
                <Text size="20pt" className="text-center">
                    Sign in
                </Text>
                <form
                    onSubmit={form.onSubmit((val) => console.log(val))}
                    className="*:mt-2"
                >
                    <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="your@email.com"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                    />
                    <TextInput
                        withAsterisk
                        label="Username"
                        placeholder="username"
                        key={form.key("username")}
                        {...form.getInputProps("username")}
                    />
                    <TextInput
                        withAsterisk
                        label="Password"
                        placeholder="password"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                    />
                    <TextInput
                        withAsterisk
                        label="Confirm Password"
                        placeholder="confirm password"
                        key={form.key("confirmPassword")}
                        {...form.getInputProps("confirmPassword")}
                    />
                    <Button type="submit" className="mt-8!">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
}
