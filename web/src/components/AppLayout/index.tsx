import { PropsWithChildren } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full flex flex-col">
            <Header />
            <div className="h-full flex flex-col">
                <div className="py-10 grow">{children}</div>
                <Footer />
            </div>
        </div>
    );
}
