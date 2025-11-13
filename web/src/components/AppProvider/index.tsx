import { MantineProvider, MantineProviderProps } from "@mantine/core";
import { PropsWithChildren } from "react";

const mantineProviderConfig: MantineProviderProps = {
    defaultColorScheme: "dark",
};

export function AppProvider({ children }: PropsWithChildren) {
    return (
        <MantineProvider {...mantineProviderConfig}>{children}</MantineProvider>
    );
}
