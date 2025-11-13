import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-1 items-center justify-center flex gap-2">
            <Link className="text-gray-600!" href="/credits">
                Credits
            </Link>
        </footer>
    );
}
