import { Text } from "@mantine/core";
export default function Credits() {
    return (
        <div className="flex flex-col gap-10 items-center pt-10">
            <Text
                component="a"
                href="https://www.flaticon.com/free-icons/waffle"
                title="waffle icons"
            >
                Waffle icons created by amonrat rungreangfangsai - Flaticon
            </Text>
        </div>
    );
}
