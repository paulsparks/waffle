import { notifications } from "@mantine/notifications";
import { User } from "kysely-codegen";
import { useCallback, useEffect, useState } from "react";

export function useUserInfo(userId?: string) {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const getUser = useCallback(async () => {
        setError(undefined);
        setLoading(true);

        const res = await fetch(`/api/auth/get-user/${userId}`, {
            method: "GET",
        });

        if (res.status === 200) {
            const user = (await res.json()) as unknown as User;
            setUser(user);
        } else {
            // TODO: Improve error handling here
            const err = "An unknown error occurred";

            notifications.show({
                message: err,
                position: "top-right",
            });

            setLoading(false);
            setError(err);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            getUser();
        }
    }, [getUser, userId]);

    return { user, loading, error };
}
