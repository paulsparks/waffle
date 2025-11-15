import crypto from "crypto";

export function emailToUsername(email: string): string {
    // Extract the local part (before '@')
    const local = email.split("@")[0];

    // Normalize to alphanumeric lowercase
    const normalized = local.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Short deterministic hash of the full email
    const hash = crypto
        .createHash("sha1")
        .update(email)
        .digest("hex")
        .slice(0, 6);

    return `${normalized}_${hash}`;
}
