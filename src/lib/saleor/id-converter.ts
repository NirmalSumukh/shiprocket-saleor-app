/**
 * Utility functions to decode and encode Saleor GraphQL IDs (which are Base64 encoded)
 * to numeric database IDs for systems (like ShipRocket) that might require/prefer numeric IDs.
 */

/**
 * Decodes a Saleor GraphQL ID (Base64) to get the database numeric ID.
 * Example: "UHJvZHVjdFZhcmlhbnQ6Mg==" (ProductVariant:2) -> "2"
 */
export function decodeSaleorId(graphqlId: string | number): string {
  if (typeof graphqlId === 'number') {
    return graphqlId.toString();
  }
  
  if (!graphqlId) return '';

  // If it's a numeric string already, return it
  if (/^\d+$/.test(graphqlId)) {
    return graphqlId;
  }

  try {
    const decoded = Buffer.from(graphqlId, 'base64').toString('utf-8');
    // Decoded string format is typically "TypeName:DatabaseId" (e.g., "ProductVariant:2")
    const parts = decoded.split(':');
    if (parts.length === 2 && /^\d+$/.test(parts[1])) {
      return parts[1];
    }
    return graphqlId;
  } catch (error) {
    // If not valid Base64, return original
    return graphqlId;
  }
}

/**
 * Encodes a numeric database ID into a Saleor GraphQL ID (Base64).
 * Example: "2", "ProductVariant" -> "UHJvZHVjdFZhcmlhbnQ6Mg=="
 */
export function encodeSaleorId(databaseId: string | number, typeName: 'Product' | 'ProductVariant' | 'Category' | 'Collection'): string {
  const dbIdStr = databaseId.toString();
  
  if (!dbIdStr) return '';

  // If it's already a base64 string, return it
  if (typeof databaseId === 'string' && (databaseId.includes('==') || !/^\d+$/.test(dbIdStr))) {
    return databaseId;
  }

  const rawId = `${typeName}:${dbIdStr}`;
  return Buffer.from(rawId, 'utf-8').toString('base64');
}
