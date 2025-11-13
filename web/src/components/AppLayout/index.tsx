import { PropsWithChildren } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Typography } from "@mantine/core";

export function AppLayout({ children }: PropsWithChildren) {
    return (
        <Typography className="h-full flex flex-col">
            <Header />
            <div className="h-full flex flex-col">
                <div className="py-10 grow">{children}</div>
                <Footer />
            </div>
        </Typography>
    );
}
