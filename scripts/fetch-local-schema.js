#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildClientSchema, printSchema } from 'graphql';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALEOR_API_URL = process.env.SALEOR_API_URL || 'http://localhost:8000/graphql/';
const OUTPUT_PATH = path.join(__dirname, '../graphql/schema.graphql');

// GraphQL Introspection Query
const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

console.log(`📥 Fetching schema from ${SALEOR_API_URL}...`);

try {
  const response = await fetch(SALEOR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: introspectionQuery,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
  }

  // Convert introspection result to SDL
  const schema = buildClientSchema(result.data);
  const schemaSDL = printSchema(schema);

  // Ensure graphql directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, schemaSDL, 'utf-8');
  console.log(`✅ Schema saved to ${OUTPUT_PATH}`);
  console.log(`📊 Schema size: ${(schemaSDL.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('❌ Error fetching schema:', error.message);
  console.error('\n⚠️  Troubleshooting:');
  console.error('1. Check Saleor is running: docker ps');
  console.error('2. Test endpoint: curl http://localhost:8000/graphql/');
  console.error('3. Verify SALEOR_API_URL in .env\n');
  process.exit(1);
}
