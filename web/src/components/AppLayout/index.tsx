"use client";

import { PropsWithChildren, useMemo } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Typography } from "@mantine/core";
import { usePathname } from "next/navigation";

const NO_LAYOUT_PATHS = ["/", "/sign-in", "/sign-up"] as const;

export function AppLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();
    const usingLayout = useMemo(
        () => !NO_LAYOUT_PATHS.some((x) => x === pathname),
        [pathname]
    );

    return (
        <Typography className="h-full flex flex-col">
            {usingLayout && <Header />}
            <div className="h-full flex flex-col">
                <div className="py-10 grow">{children}</div>
                {usingLayout && <Footer />}
            </div>
        </Typography>
    );
}
