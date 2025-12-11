"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

// Utility function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

interface ProblemCardProps {
  problem: {
    title: string;
    description: string;
    difficulty: string;
    authorId: string;
    id: string;
  };
}
const difficultyTone = (difficulty: string) => {
  if (difficulty === "Easy") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (difficulty === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
  if (difficulty === "Hard") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-slate-100 text-slate-800 border-slate-200";
};

const ProblemCard = ({ problem }: ProblemCardProps) => {
  const router = useRouter();
  const firstLineHtml = problem.description.split("<br />")[0] || "";
  const cleanDescription = stripHtmlTags(firstLineHtml).slice(0, 140) + (stripHtmlTags(firstLineHtml).length > 140 ? "…" : "");

  return (
    <Card className="w-full md:w-[38vw] lg:w-[30vw] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-slate-900">{problem.title}</CardTitle>
          <Badge variant="outline" className={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-700 leading-relaxed">
          {cleanDescription}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={() => router.push(`/problem/${problem.id}`)}
          className="font-semibold w-full"
        >
          Solve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProblemCard;