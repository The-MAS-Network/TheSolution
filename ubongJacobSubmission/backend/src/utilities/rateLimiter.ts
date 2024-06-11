// THIS IS IN MEMORY AND MIGHT NOT WORK EFFICIENTLY WHEN THERE ARE MULTIPLE BACKENDS THAT LIES BEHIND A LOAD BALANCER.

const getIp = () => {
  /**
   * const forwardedFor = headers().get("x-forwared-for");
   * const realIp = headers().get("x-real-ip")
   *
   * if (forwardedFor){
   * return fowardedFor.split(",")?.[0].trim();
   * }
   *
   * if(realIp){
   *  return realIp.trim()
   * }
   *
   * return null;
   */
  return "";
};

const trackers: Record<string, { count: number; expiresAt: number }> = {};

export function rateLimitByIp(limit = 1, window = 10_000) {
  const ip = getIp();

  if (!ip) {
    return "IP address not found.";
  }

  const tracker = trackers[ip] || { count: 0, expiresAt: 0 };
  if (!trackers[ip]) {
    trackers[ip] = tracker;
  }

  if (tracker?.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  if (tracker?.count > limit) {
    return "Rate limit exceeded.";
  }
  return;
}
export function rateLimitByKey(key: string, limit = 10, window = 10_000) {
  const tracker = trackers[key] || { count: 0, expiresAt: 0 };

  if (!trackers[key]) {
    trackers[key] = tracker;
  }

  if (tracker?.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  if (tracker?.count > limit) {
    return "Rate limit exceeded.";
  }
  return;
}
