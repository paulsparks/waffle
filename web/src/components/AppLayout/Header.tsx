import Link from "next/link";

export function Header() {
    return (
        <div className="flex underline justify-center items-center py-2">
            <Link href="/">Home</Link>
        </div>
    );
}
