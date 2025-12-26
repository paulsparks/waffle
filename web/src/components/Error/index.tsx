import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export interface ErrorProps {
    msg: string;
    className?: string;
}

export function Error({ msg, className }: ErrorProps) {
    return (
        <Alert
            variant="light"
            color="red"
            title="Error"
            icon={<IconInfoCircle />}
            className={className}
        >
            {msg}
        </Alert>
    );
}
