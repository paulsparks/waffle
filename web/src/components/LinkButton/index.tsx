import { Button, ButtonProps } from "@mantine/core";
import { useRouter } from "next/navigation";

export interface LinkButtonProps extends Omit<ButtonProps, "onClick"> {
    href: string;
}

export function LinkButton({ href, ...buttonProps }: LinkButtonProps) {
    const router = useRouter();

    return (
        <Button
            onClick={() => {
                router.push(href);
            }}
            {...buttonProps}
        />
    );
}
