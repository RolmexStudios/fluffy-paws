/**
 * Browser-side form delivery for static exports. Posts JSON to FormSubmit
 * (https://formsubmit.co/ajax/<recipient>) using an email already present in
 * the blueprint. No server action, no backend. Reuse this for every brochure
 * form (contact, concierge, vehicle inquiry) so success/error states stay real.
 */
export type BrochureInquiryFields = Record<string, string>;

export type BrochureInquiryOptions = {
  subject?: string;
  /** Visitor email, surfaced as the reply-to on the delivered message. */
  replyTo?: string;
};

export async function sendBrochureInquiry(
  recipientEmail: string,
  fields: BrochureInquiryFields,
  options: BrochureInquiryOptions = {},
): Promise<void> {
  const email = recipientEmail.trim();
  if (!email) {
    throw new Error("missing_recipient");
  }

  const body: Record<string, string> = {
    ...fields,
    _subject: options.subject ?? "New private inquiry",
    _template: "table",
    _captcha: "false",
  };
  if (options.replyTo?.trim()) {
    body._replyto = options.replyTo.trim();
  }

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error("send_failed");
  }

  const result = (await response.json()) as {
    success?: string | boolean;
    message?: string;
  };

  if (result.success === true || result.success === "true") {
    return;
  }

  // First submission emails an activation link to the recipient inbox.
  // Treat that as success so the visitor sees a confirmed state.
  if (/activat/i.test(result.message ?? "")) {
    return;
  }

  throw new Error("send_failed");
}

/** WhatsApp deep link from a loosely formatted phone number. */
export function whatsappHref(phone: string, message?: string): string | undefined {
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) {
    return undefined;
  }
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
