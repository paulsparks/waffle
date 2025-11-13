"use client";

import { PropsWithChildren } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Typography } from "@mantine/core";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();

    return (
        <Typography className="h-full flex flex-col">
            {pathname !== "/" && <Header />}
            <div className="h-full flex flex-col">
                <div className="py-10 grow">{children}</div>
                {pathname !== "/" && <Footer />}
            </div>
        </Typography>
    );
}
