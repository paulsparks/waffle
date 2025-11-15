"use client";

import {
    Button,
    createTheme,
    DEFAULT_THEME,
    mergeMantineTheme,
    Text,
} from "@mantine/core";

export const themeColors = {
    waffleBrown: [
        "#f9f5f0",
        "#eee8e2",
        "#decebf",
        "#cfb298",
        "#c29b77",
        "#ba8c61",
        "#b78456",
        "#a17146",
        "#8f643c",
        "#7b542f",
    ],
    waffleLightBrown: [
        "#fff6e8",
        "#f8ead6",
        "#f0d4ac",
        "#e8bc7e",
        "#e1a857",
        "#dd9b3e",
        "#dc9430",
        "#c38023",
        "#b6771d",
        "#976110",
    ],
    waffleOrange: [
        "#fff7eb",
        "#fcedd5",
        "#fcdaa4",
        "#fcc56f",
        "#fcb344",
        "#fca82c",
        "#fca222",
        "#e08d17",
        "#c87d0f",
        "#593700",
    ],
    waffleTan: [
        "#fff8e1",
        "#ffefcb",
        "#ffdd9a",
        "#ffcf71",
        "#ffbb38",
        "#ffb11b",
        "#ffac09",
        "#e39600",
        "#ca8500",
        "#b07200",
    ],
} as const;

const themeOverride = createTheme({
    colors: {
        ...themeColors,
    },
    primaryColor: "waffleOrange",
    defaultRadius: 6,
    components: {
        Button: Button.extend({
            defaultProps: {
                variant: "outline",
            },
        }),
        Text: Text.extend({
            defaultProps: {
                c: themeColors.waffleTan[2],
            },
        }),
    },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
