"use client";

import { signUpSchema } from "@/src/app/sign-up/page";
import { authClient } from "@/src/utils/auth-client";
import {
    ActionIcon,
    Button,
    Skeleton,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Error } from "@/src/components/Error";
import { IconArrowLeft } from "@tabler/icons-react";
import { User } from "kysely-codegen";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import { omit } from "radash";
import { useCallback, useEffect, useRef, useState } from "react";
import z from "zod";

export const editProfileSchema = signUpSchema
    .pick({
        name: true,
        username: true,
    })
    .extend({
        bio: z
            .string()
            .max(200, { error: "Bio must not exceed 200 characters" }),
    });

export type EditProfile = z.infer<typeof editProfileSchema>;

export default function Profile() {
    const [error, setError] = useState<string>();
    const { data } = authClient.useSession();
    const router = useRouter();
    const [editingProfile, setEditingProfile] = useState(false);
    const initialized = useRef(false);

    const form = useForm<EditProfile>({
        validate: zod4Resolver(editProfileSchema),
        mode: "uncontrolled",
    });

    const onSubmit = useCallback(async (formData: EditProfile) => {
        const { error, data } = await authClient.updateUser({
            ...formData,
        });

        setError(error?.message);

        if (data) {
            setEditingProfile(false);
        }
    }, []);

    useEffect(() => {
        if (initialized.current) {
            return;
        }

        if (!data?.user) {
            return;
        }

        initialized.current = true;

        form.setInitialValues({
            name: data.user.name ?? "",
            username: data.user.username ?? "",
            bio: (data.user as unknown as User).bio ?? "",
        });

        form.reset();
    }, [data?.user, form]);

    return (
        <div className="flex flex-col h-full items-center gap-4 pt-10">
            <div className="flex w-xl items-center justify-between">
                <div className="flex-1 flex items-center justify-start">
                    <ActionIcon onClick={() => router.push("/profile")}>
                        <IconArrowLeft />
                    </ActionIcon>
                </div>
                <h1 className="flex-1 text-center mx-0! mb-0! mt-2!">
                    Settings
                </h1>
                <div className="flex-1"></div>
            </div>

            <Skeleton
                visible={!data?.user}
                className="flex flex-col items-center w-sm! mx-auto gap-4"
            >
                {data?.user && (
                    <>
                        <div>
                            {!editingProfile && (
                                <>
                                    {Object.keys(
                                        omit(data.user, [
                                            "createdAt",
                                            "updatedAt",
                                            "image",
                                            "emailVerified",
                                            "displayUsername",
                                        ])
                                    ).map((key) => (
                                        <p key={key}>
                                            {key}:{" "}
                                            {
                                                data.user[
                                                    key as keyof Omit<
                                                        typeof data.user,
                                                        | "createdAt"
                                                        | "updatedAt"
                                                        | "image"
                                                        | "emailVerified"
                                                        | "displayUsername"
                                                    >
                                                ]
                                            }
                                        </p>
                                    ))}
                                </>
                            )}
                            {editingProfile && (
                                <>
                                    <form
                                        className="*:mt-2 w-xs"
                                        onSubmit={form.onSubmit(onSubmit)}
                                    >
                                        <TextInput
                                            label="Name"
                                            placeholder="Name"
                                            key={form.key("name")}
                                            {...form.getInputProps("name")}
                                        />
                                        <TextInput
                                            label="Username"
                                            placeholder="Username"
                                            key={form.key("username")}
                                            {...form.getInputProps("username")}
                                        />
                                        <Textarea
                                            label="Bio"
                                            placeholder="Bio"
                                            key={form.key("bio")}
                                            {...form.getInputProps("bio")}
                                        />
                                        {editingProfile && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        setEditingProfile(
                                                            false
                                                        );
                                                        form.reset();
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit">
                                                    Done
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                    {error && (
                                        <Error msg={error} className="mt-8!" />
                                    )}
                                </>
                            )}
                        </div>

                        {!editingProfile && (
                            <Button
                                onClick={() => {
                                    setEditingProfile(true);
                                }}
                            >
                                Edit profile
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                authClient.signOut();
                            }}
                            variant="light"
                            color="red"
                        >
                            Sign out
                        </Button>
                    </>
                )}
            </Skeleton>
        </div>
    );
}
