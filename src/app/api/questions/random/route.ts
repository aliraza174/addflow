import { NextResponse } from "next/server";

const questions = [
  {
    question: "Why should expired ads be hidden from public search?",
    answer: "It prevents stale inventory and keeps trust and ranking quality high.",
    topic: "workflow",
    difficulty: "easy",
  },
  {
    question: "Why track ad_status_history and audit_logs separately?",
    answer: "One tracks lifecycle state transitions, the other captures actor-level traceability.",
    topic: "traceability",
    difficulty: "medium",
  },
  {
    question: "How does ranking differ from simple newest-first sorting?",
    answer: "Ranking accounts for package strength, featured status, freshness, and manual boosts.",
    topic: "ranking",
    difficulty: "medium",
  },
];

export async function GET() {
  const pick = questions[Math.floor(Math.random() * questions.length)];
  return NextResponse.json({ item: pick });
}

