import { notFound } from "next/navigation";
import { findLesson, sampleCourse } from "@/lib/sample-curriculum";
import LessonShell from "@/components/lessons/LessonShell";

interface Params {
  courseSlug: string;
  lessonSlug: string;
}

export default async function LessonPage({
  params
}: {
  params: Promise<Params>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const found = findLesson(sampleCourse, courseSlug, lessonSlug);
  if (!found) notFound();
  return <LessonShell course={sampleCourse} module={found.module} lesson={found.lesson} />;
}
