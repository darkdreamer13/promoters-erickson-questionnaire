import { NextResponse } from "next/server";
import { Resend } from "resend";
import { questions, isQuestionVisible } from "@/data/questions";
import type { Answers } from "@/types/questionnaire";

export const runtime = "nodejs";

const MAX_TOTAL_CHARS = 30_000;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeAnswer(value: unknown): string | string[] | undefined {
  if (typeof value === "string") return value.trim().slice(0, 5000);
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().slice(0, 500))
      .slice(0, 20);
  }
  return undefined;
}

function validateAnswers(rawAnswers: unknown): { answers?: Answers; error?: string } {
  if (!rawAnswers || typeof rawAnswers !== "object" || Array.isArray(rawAnswers)) {
    return { error: "Μη έγκυρη φόρμα." };
  }

  const answers: Answers = {};
  let totalChars = 0;

  for (const [key, rawValue] of Object.entries(rawAnswers as Record<string, unknown>)) {
    const normalized = normalizeAnswer(rawValue);
    if (normalized === undefined) continue;

    const valueChars = Array.isArray(normalized)
      ? normalized.reduce((sum, item) => sum + item.length, 0)
      : normalized.length;
    totalChars += valueChars;

    if (totalChars > MAX_TOTAL_CHARS) {
      return { error: "Οι απαντήσεις είναι μεγαλύτερες από το επιτρεπόμενο όριο." };
    }

    answers[key] = normalized;
  }

  for (const question of questions) {
    if (!isQuestionVisible(question, answers) || !question.required) continue;
    const value = answers[question.id];
    const empty = Array.isArray(value) ? value.length === 0 : !value?.trim();
    if (empty) return { error: `Λείπει απάντηση: ${question.title}` };

    if (question.maxSelections && Array.isArray(value) && value.length > question.maxSelections) {
      return { error: `Έχουν επιλεγεί περισσότερες απαντήσεις από το επιτρεπόμενο όριο: ${question.title}` };
    }
  }

  return { answers };
}

function renderAnswer(value: string | string[]) {
  if (Array.isArray(value)) {
    return `<ul style="margin:8px 0 0;padding-left:20px">${value
      .map((item) => `<li style="margin:4px 0">${escapeHtml(item)}</li>`)
      .join("")}</ul>`;
  }
  return `<div style="margin-top:8px;white-space:pre-wrap">${escapeHtml(value || "—")}</div>`;
}

function buildEmailHtml(answers: Answers) {
  const sections = new Map<string, typeof questions>();

  for (const question of questions) {
    if (!isQuestionVisible(question, answers)) continue;
    const value = answers[question.id];
    if (!value || (Array.isArray(value) && value.length === 0)) continue;
    const sectionQuestions = sections.get(question.section) ?? [];
    sectionQuestions.push(question);
    sections.set(question.section, sectionQuestions);
  }

  const body = Array.from(sections.entries())
    .map(([section, sectionQuestions]) => `
      <div style="margin-top:30px">
        <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6256A5;margin-bottom:12px">${escapeHtml(section)}</div>
        ${sectionQuestions
          .map((question) => {
            const value = answers[question.id];
            if (!value) return "";
            return `
              <div style="padding:16px 0;border-top:1px solid #eee">
                <div style="font-size:14px;font-weight:700;color:#231F20;line-height:1.45">${escapeHtml(question.title)}</div>
                <div style="font-size:14px;color:#545556;line-height:1.6">${renderAnswer(value)}</div>
              </div>`;
          })
          .join("")}
      </div>`)
    .join("");

  return `<!doctype html>
  <html lang="el">
    <body style="margin:0;background:#f7f5f8;font-family:Arial,Helvetica,sans-serif;color:#231F20">
      <div style="max-width:720px;margin:0 auto;padding:32px 16px">
        <div style="background:#fff;border:1px solid #ece8ee;border-radius:14px;padding:32px">
          <div style="height:5px;border-radius:99px;background:linear-gradient(135deg,#E33B95,#B8439A,#6256A5);margin-bottom:28px"></div>
          <div style="font-size:12px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#6256A5">Promoters · Client Intake</div>
          <h1 style="font-size:26px;line-height:1.2;margin:10px 0 8px">Νέο campaign brief — Erickson Coaching Greece</h1>
          <p style="font-size:14px;color:#545556;line-height:1.6;margin:0">Η φόρμα υποβλήθηκε στις ${escapeHtml(new Intl.DateTimeFormat("el-GR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Athens" }).format(new Date()))}.</p>
          ${body}
        </div>
      </div>
    </body>
  </html>`;
}

function buildPlainText(answers: Answers) {
  const lines = ["Νέο campaign brief — Erickson Coaching Greece", ""];
  let lastSection = "";

  for (const question of questions) {
    if (!isQuestionVisible(question, answers)) continue;
    const value = answers[question.id];
    if (!value || (Array.isArray(value) && value.length === 0)) continue;

    if (question.section !== lastSection) {
      lastSection = question.section;
      lines.push(`=== ${lastSection.toUpperCase()} ===`);
    }
    lines.push(question.title);
    lines.push(Array.isArray(value) ? value.map((item) => `- ${item}`).join("\n") : value);
    lines.push("");
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { answers?: unknown; website?: unknown };

    // Honeypot: bots receive a successful response but no email is sent.
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true });
    }

    const validation = validateAnswers(body.answers);
    if (!validation.answers) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.FORM_FROM_EMAIL;
    const to = process.env.FORM_TO_EMAIL || "info@promoters.gr";

    if (!apiKey || !from) {
      console.error("Missing RESEND_API_KEY or FORM_FROM_EMAIL");
      return NextResponse.json(
        { ok: false, error: "Η αποστολή δεν έχει ρυθμιστεί ακόμη. Επικοινωνήστε με την Promoters." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: "Νέο campaign brief — Erickson Coaching Greece",
      html: buildEmailHtml(validation.answers),
      text: buildPlainText(validation.answers)
    });

    if (error) {
      console.error("Resend error", error);
      return NextResponse.json(
        { ok: false, error: "Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Questionnaire submission error", error);
    return NextResponse.json(
      { ok: false, error: "Παρουσιάστηκε ένα πρόβλημα κατά την αποστολή. Δοκιμάστε ξανά." },
      { status: 500 }
    );
  }
}
