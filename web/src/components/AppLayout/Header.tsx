import { Tabs } from "@mantine/core";
import { IconHome, IconUser } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { WaffleTextLogo } from "../WaffleTextLogo";
import { useCallback, useMemo } from "react";
import { isEmpty } from "radash";
import Link from "next/link";

const PATHS = {
    Home: {
        path: "/home",
        hasText: false,
        icon: <IconHome />,
    },
    Profile: {
        path: "/profile",
        hasText: false,
        icon: <IconUser />,
    },
} as const;

const PATH_LOCATIONS: Record<"middle" | "right", Array<keyof typeof PATHS>> = {
    middle: ["Home"],
    right: ["Profile"],
};

export function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const createTabs = useCallback(
        (paths: Array<keyof typeof PATHS>) =>
            paths
                .filter((p) => p in PATHS)
                .map((key) => {
                    const p = PATHS[key as keyof typeof PATHS];

                    return (
                        <Tabs.Tab
                            onClick={() => router.push(p.path)}
                            key={p.path}
                            value={p.path}
                            leftSection={p.icon}
                        >
                            {p.hasText && key}
                        </Tabs.Tab>
                    );
                }),
        [router]
    );

    const tabs = useMemo(
        () => ({
            middle: createTabs(PATH_LOCATIONS.middle),
            right: createTabs(PATH_LOCATIONS.right),
        }),
        [createTabs]
    );

    return (
        <div className="flex justify-between items-center fixed w-full bg-waffle-header">
            <div className="flex-1 h-full flex flex-col justify-center">
                <Link href="/home" className="no-underline! pl-4 text-2xl">
                    <WaffleTextLogo />
                </Link>
            </div>
            {isEmpty(tabs.middle) ? (
                <div className="flex-1" />
            ) : (
                <Tabs value={pathname} className="flex-1 h-full">
                    <Tabs.List className="w-fit mx-auto h-full">
                        {tabs.middle}
                    </Tabs.List>
                </Tabs>
            )}
            {isEmpty(tabs.right) ? (
                <div className="flex-1" />
            ) : (
                <Tabs value={pathname} className="flex-1 h-full">
                    <Tabs.List className="w-fit ml-auto h-full">
                        {tabs.right}
                    </Tabs.List>
                </Tabs>
            )}
        </div>
    );
}
