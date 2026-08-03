import { headers } from 'next/headers';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headerList.get('x-real-ip') || '127.0.0.1';
}

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  
  // Cleanup expired
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }

  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, count: 1, limit, remaining: limit - 1, resetTime: store[ip].resetTime };
  }

  const record = store[ip];
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { success: true, count: 1, limit, remaining: limit - 1, resetTime: record.resetTime };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  const success = record.count <= limit;

  return {
    success,
    count: record.count,
    limit,
    remaining,
    resetTime: record.resetTime,
  };
}
