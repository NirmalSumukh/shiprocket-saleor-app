import { verifySignatureWithJwks } from "@saleor/app-sdk/auth";

/**
 * Custom JWKS verification function that always falls back to a remote fetch.
 *
 * The default SDK behavior:
 *  1. Try cached JWKS → if fails, fetch fresh JWKS → if still fails, throw SIGNATURE_VERIFICATION_FAILED
 *
 * The problem: when keys are stale AND the remote fetch from the stored saleorApiUrl fails
 * (e.g. network issues between containers), verification always fails.
 *
 * This override adds a second fallback using exactly SALEOR_API_URL from env,
 * which can point to the internal/direct Saleor address and bypass proxy issues.
 *
 * If SALEOR_API_URL_INTERNAL is set, it will be used instead of SALEOR_API_URL for JWKS fetching.
 */
export async function verifySignatureWithFreshJwks(
    jwks: string,
    signature: string,
    rawBody: string
): Promise<void> {
    // First try with the provided cached JWKS (standard behavior)
    try {
        await verifySignatureWithJwks(jwks, signature, rawBody);
        return; // Success
    } catch {
        // Cached JWKS failed, fall through to remote fetch
    }

    // Build a remote JWKS JSON string from the Saleor API URL
    const saleorApiUrl =
        process.env.SALEOR_API_URL_INTERNAL || process.env.SALEOR_API_URL;

    if (!saleorApiUrl) {
        throw new Error(
            "JWKS signature verification failed and SALEOR_API_URL is not set for remote fallback"
        );
    }

    try {
        const jwksUrl = `${new URL(saleorApiUrl).origin}/.well-known/jwks.json`;
        const response = await fetch(jwksUrl);
        if (!response.ok) {
            throw new Error(`JWKS fetch returned ${response.status}`);
        }
        const freshJwks = await response.text();
        await verifySignatureWithJwks(freshJwks, signature, rawBody);
    } catch (err: any) {
        throw new Error(
            `JWKS signature verification failed (cached and remote): ${err?.message}`
        );
    }
}
