import { Tabs } from "@mantine/core";
import { IconHome, IconUser, ReactNode } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

const PATHS = {
    Home: "/home",
    Profile: "/profile",
} as const;

const PATH_ICONS: Record<(typeof PATHS)[keyof typeof PATHS], ReactNode> = {
    "/home": <IconHome />,
    "/profile": <IconUser />,
};

const MIDDLE_PATHS: Array<keyof typeof PATHS> = ["Home"];
const RIGHT_PATHS: Array<keyof typeof PATHS> = ["Profile"];

export function Header() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <Tabs value={pathname} className="flex-1">
                <Tabs.List className="w-fit mx-auto">
                    {MIDDLE_PATHS.filter((p) => p in PATHS).map((path) => (
                        <Tabs.Tab
                            onClick={() =>
                                router.push(PATHS[path as keyof typeof PATHS])
                            }
                            key={PATHS[path as keyof typeof PATHS]}
                            value={PATHS[path as keyof typeof PATHS]}
                            leftSection={
                                PATH_ICONS[PATHS[path as keyof typeof PATHS]]
                            }
                        >
                            {path}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs>
            <Tabs value={pathname} className="flex-1">
                <Tabs.List className="w-fit ml-auto">
                    {RIGHT_PATHS.filter((p) => p in PATHS).map((path) => (
                        <Tabs.Tab
                            onClick={() =>
                                router.push(PATHS[path as keyof typeof PATHS])
                            }
                            key={PATHS[path as keyof typeof PATHS]}
                            value={PATHS[path as keyof typeof PATHS]}
                            leftSection={
                                PATH_ICONS[PATHS[path as keyof typeof PATHS]]
                            }
                        >
                            {path}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs>
        </div>
    );
}
