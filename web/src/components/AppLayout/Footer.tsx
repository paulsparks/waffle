import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-2 items-center justify-center flex gap-2 underline">
            <Link href="/credits">Credits</Link>
        </footer>
    );
}
