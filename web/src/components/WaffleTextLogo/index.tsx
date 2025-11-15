import { themeColors } from "@/src/utils/theme";
import { Text, TextProps } from "@mantine/core";
import { Cal_Sans } from "next/font/google";

const calSans = Cal_Sans({
    subsets: ["latin"],
    weight: "400",
});

export interface WaffleTextLogoProps {
    className?: string;
    size?: TextProps["size"];
    withIcon?: boolean;
}

export function WaffleTextLogo({ className, size }: WaffleTextLogoProps) {
    return (
        <Text
            component="span"
            variant="gradient"
            gradient={{
                from: themeColors.waffleOrange[4],
                to: themeColors.waffleLightBrown[9],
            }}
            inherit
            className={`${calSans.className} ${className}`}
            size={size}
        >
            Waffle :&gt;
        </Text>
    );
}
