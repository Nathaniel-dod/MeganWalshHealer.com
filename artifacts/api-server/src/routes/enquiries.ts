import { Router, type IRouter } from "express";
import { db, enquiriesTable } from "@workspace/db";
import { CreateEnquiryBody, CreateEnquiryResponse } from "@workspace/api-zod";

const router: IRouter = Router();
const requests = new Map<string, { count: number; resetAt: number }>();
const windowMs = 15 * 60 * 1000;

router.post("/enquiries", async (req, res): Promise<void> => {
  const now = Date.now();
  for (const [key, value] of requests) {
    if (value.resetAt <= now) requests.delete(key);
  }
  const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const bucket = requests.get(key) ?? { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  requests.set(key, bucket);
  if (bucket.count > 8) {
    res.set("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
    res.status(429).json({ error: "Please wait a few minutes before trying again." });
    return;
  }
  const parsed = CreateEnquiryBody.safeParse(req.body);
  if (!parsed.success || !parsed.data.name.trim() || !parsed.data.message.trim() || parsed.data.consent !== true) {
    res.status(400).json({ error: "Please complete all fields and consent to storing your enquiry." });
    return;
  }
  try {
    const [enquiry] = await db.insert(enquiriesTable).values({
      ...parsed.data,
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim(),
      message: parsed.data.message.trim(),
    }).returning({ id: enquiriesTable.id });
    res.status(201).json(CreateEnquiryResponse.parse({
      id: enquiry.id,
      message: "Your enquiry has been saved. Email notifications are not yet connected, so no email has been sent.",
    }));
  } catch {
    req.log.error("Could not save enquiry");
    res.status(503).json({ error: "Your enquiry could not be saved. Please try again later." });
  }
});

export default router;
