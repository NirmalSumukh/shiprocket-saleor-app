import { APL, AuthData } from "@saleor/app-sdk/APL";

/**
 * Wraps any APL and normalizes saleorApiUrl keys to always use HTTPS.
 *
 * Problem: Saleor may send webhooks with "http://saleor.leemasmart.com/graphql/"
 * in the `saleor-api-url` header, but the app was registered with the HTTPS URL.
 * This causes the SDK to fail finding auth data ("NOT_REGISTERED").
 *
 * Solution: Normalise ALL url lookups so http:// → https:// for known production hosts,
 * ensuring the APL always finds a match regardless of which protocol Saleor sends.
 */

const PRODUCTION_HOSTS = ["saleor.leemasmart.com", "leemasmart.com"];

function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        if (PRODUCTION_HOSTS.some((host) => parsed.hostname.includes(host))) {
            parsed.protocol = "https:";
            return parsed.toString();
        }
    } catch {
        // Return original if unparsable
    }
    return url;
}

export class NormalizingAPL implements APL {
    constructor(private readonly inner: APL) { }

    async get(saleorApiUrl: string): Promise<AuthData | undefined> {
        const normalized = normalizeUrl(saleorApiUrl);
        const result = await this.inner.get(normalized);
        if (!result && normalized !== saleorApiUrl) {
            // Fallback: also try the original URL in case it was stored differently
            return this.inner.get(saleorApiUrl);
        }
        return result;
    }

    async set(authData: AuthData): Promise<void> {
        const normalized = normalizeUrl(authData.saleorApiUrl);
        return this.inner.set({ ...authData, saleorApiUrl: normalized });
    }

    async delete(saleorApiUrl: string): Promise<void> {
        const normalized = normalizeUrl(saleorApiUrl);
        return this.inner.delete(normalized);
    }

    async getAll(): Promise<AuthData[]> {
        return this.inner.getAll();
    }

    // Forward isConfigured if the inner APL has it
    get isConfigured() {
        return (this.inner as any).isConfigured;
    }
}
