import "./globals.css";
import "@mantine/core/styles.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppLayout } from "../components/AppLayout";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { AppProvider } from "../components/AppProvider";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Waffle",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body className={`${inter.variable} antialiased h-full`}>
                <AppProvider>
                    <AppLayout>{children}</AppLayout>
                </AppProvider>
            </body>
        </html>
    );
}
