import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getResultsByUserId, saveAssessmentResult } from "@/lib/data/assessments";
import { getSessionFromRequest } from "@/lib/auth/session";

const resultSchema = z.object({
  assessmentId: z.string().min(1),
  assessmentTitle: z.string().min(1),
  category: z.string().min(1),
  userId: z.string().min(1),
  scorePercentage: z.number().int().min(0).max(100),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedAnswer: z.string().min(1),
    })
  ),
  completedAt: z.string().datetime(),
});

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    if (session.role !== "admin" && session.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const results = await getResultsByUserId(userId);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load results", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const payload = resultSchema.parse(json);

    if (session.role !== "admin" && session.userId !== payload.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await saveAssessmentResult(payload);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Failed to save result", error: String(error) },
      { status: 500 }
    );
  }
}
