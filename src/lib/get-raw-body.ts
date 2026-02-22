import { NextApiRequest } from 'next';

export async function getRawBody(req: NextApiRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        let rawBody = '';
        req.on('data', (chunk) => {
            rawBody += chunk.toString('utf8');
        });
        req.on('end', () => {
            resolve(rawBody);
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
}
