import { theme } from "@/src/utils/theme";
import { MantineProvider, MantineProviderProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { PropsWithChildren } from "react";

const mantineProviderConfig: MantineProviderProps = {
    defaultColorScheme: "dark",
};

export function AppProvider({ children }: PropsWithChildren) {
    return (
        <MantineProvider theme={theme} {...mantineProviderConfig}>
            <Notifications />
            {children}
        </MantineProvider>
    );
}
