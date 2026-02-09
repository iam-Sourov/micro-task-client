"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Coins, Calendar, User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { appUser } = useAuth();
  const id = params?.id as string;
  const [task, setTask] = useState<any>(null);
  const [submissionDetails, setSubmissionDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !id) return;
    fetch(`${API_URL}/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then(setTask)
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!submissionDetails.trim()) {
      setError("Please provide submission details.");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser || !task) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_id: task._id,
          task_title: task.task_title,
          payable_amount: task.payable_amount,
          worker_email: appUser.email,
          submission_details: submissionDetails.trim(),
          worker_name: appUser.name || appUser.email,
          buyer_name: task.buyer_name,
          buyer_email: task.buyer_email,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      router.push("/dashboard/my-submissions");
    } catch {
      setError("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!task) return <p className="text-muted-foreground">Task not found.</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Task Details</h1>
      <Card>
        <CardContent className="p-6">
          {task.task_image_url && (
            <img
              src={task.task_image_url}
              alt=""
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h2 className="text-xl font-semibold">{task.task_title}</h2>
          <p className="text-muted-foreground mt-2">{task.task_detail}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
            <User className="h-4 w-4" />
            Buyer: {task.buyer_name}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="h-4 w-4" />
            Deadline: {task.completion_date ? new Date(task.completion_date).toLocaleDateString() : "-"}
          </p>
          <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
            <Coins className="h-4 w-4" />
            {task.payable_amount} coins per worker
          </p>
          <p className="text-sm mt-2">
            <span className="font-medium">Submission info:</span> {task.submission_info}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Submit Your Work</h3>
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="submission_details">Submission Details</Label>
              <Textarea
                id="submission_details"
                placeholder="Paste proof, screenshot link, or description..."
                value={submissionDetails}
                onChange={(e) => setSubmissionDetails(e.target.value)}
                className="mt-1 min-h-[120px]"
                required
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
