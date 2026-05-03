import { redirect } from "next/navigation";
import { sampleCourse } from "@/lib/sample-curriculum";

export default function LessonsIndex() {
  const flat = sampleCourse.modules.flatMap((m) => m.lessons);
  const current = flat.find((l) => l.status === "current") ?? flat[0];
  redirect(`/lessons/${sampleCourse.slug}/${current.slug}`);
}
