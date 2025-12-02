import { describe, it, expect } from 'vitest';
import { generateHMAC, verifyHMAC } from '../hmac';

describe('HMAC Utilities', () => {
  const testPayload = { test: 'data', number: 123 };
  
  it('should generate consistent HMAC for same payload', () => {
    const hmac1 = generateHMAC(testPayload);
    const hmac2 = generateHMAC(testPayload);
    
    expect(hmac1).toBe(hmac2);
  });

  it('should verify valid HMAC', () => {
    const hmac = generateHMAC(testPayload);
    const isValid = verifyHMAC(testPayload, hmac);
    
    expect(isValid).toBe(true);
  });

  it('should reject invalid HMAC', () => {
    const invalidHmac = 'invalid-hmac-signature';
    const isValid = verifyHMAC(testPayload, invalidHmac);
    
    expect(isValid).toBe(false);
  });

  it('should handle string payloads', () => {
    const stringPayload = JSON.stringify(testPayload);
    const hmac = generateHMAC(stringPayload);
    
    expect(hmac).toBeTruthy();
    expect(typeof hmac).toBe('string');
  });
});
