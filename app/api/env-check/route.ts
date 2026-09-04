import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    resendApiKeyConfigured: Boolean(process.env.RESEND_API_KEY),
    formFromEmailConfigured: Boolean(process.env.FORM_FROM_EMAIL),
    formToEmailConfigured: Boolean(process.env.FORM_TO_EMAIL),
  });
}
