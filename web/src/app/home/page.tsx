import { Text } from "@mantine/core";

export default function Home() {
    return (
        <div className="flex flex-col justify-center h-full text-center">
            <Text size="lg">
                Welcome to{" "}
                <Text
                    component="span"
                    variant="gradient"
                    gradient={{ from: "orange", to: "yellow" }}
                    inherit
                >
                    Waffle
                </Text>
                !
            </Text>
        </div>
    );
}
