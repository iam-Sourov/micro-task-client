"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AddTaskPage() {
  const { appUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    task_title: "",
    task_detail: "",
    required_workers: "",
    payable_amount: "",
    completion_date: "",
    submission_info: "",
    task_image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const required = Number(form.required_workers);
    const payable = Number(form.payable_amount);
    const total = required * payable;
    if (!appUser?.email) return;
    if (total > (appUser.coins ?? 0)) {
      setError("Not enough coins. Please purchase coins.");
      router.push("/dashboard/purchase-coin");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_title: form.task_title,
          task_detail: form.task_detail,
          required_workers: required,
          payable_amount: payable,
          completion_date: form.completion_date || undefined,
          submission_info: form.submission_info,
          task_image_url: form.task_image_url,
          buyer_email: appUser.email,
          buyer_name: appUser.name || appUser.email,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.needCoins) {
          setError("Not enough coins. Please purchase coins.");
          router.push("/dashboard/purchase-coin");
          return;
        }
        throw new Error(data.message || "Failed to add task");
      }
      router.push("/dashboard/my-tasks");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const totalPayable =
    form.required_workers && form.payable_amount
      ? Number(form.required_workers) * Number(form.payable_amount)
      : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Add New Task</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="task_title">Task Title</Label>
              <Input
                id="task_title"
                value={form.task_title}
                onChange={(e) => setForm((f) => ({ ...f, task_title: e.target.value }))}
                placeholder="e.g. Watch my YouTube video and leave a comment"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="task_detail">Task Detail</Label>
              <Textarea
                id="task_detail"
                value={form.task_detail}
                onChange={(e) => setForm((f) => ({ ...f, task_detail: e.target.value }))}
                placeholder="Detailed description for workers"
                className="mt-1 min-h-[80px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="required_workers">Required Workers</Label>
                <Input
                  id="required_workers"
                  type="number"
                  min={1}
                  value={form.required_workers}
                  onChange={(e) => setForm((f) => ({ ...f, required_workers: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="payable_amount">Payable Amount (coins per worker)</Label>
                <Input
                  id="payable_amount"
                  type="number"
                  min={1}
                  value={form.payable_amount}
                  onChange={(e) => setForm((f) => ({ ...f, payable_amount: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            {totalPayable > 0 && (
              <p className="text-sm text-muted-foreground">
                Total payable: {totalPayable} coins. Your balance: {appUser?.coins ?? 0} coins.
              </p>
            )}
            <div>
              <Label htmlFor="completion_date">Completion Date (deadline)</Label>
              <Input
                id="completion_date"
                type="date"
                value={form.completion_date}
                onChange={(e) => setForm((f) => ({ ...f, completion_date: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="submission_info">Submission Info</Label>
              <Input
                id="submission_info"
                value={form.submission_info}
                onChange={(e) => setForm((f) => ({ ...f, submission_info: e.target.value }))}
                placeholder="e.g. Screenshot or proof link"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="task_image_url">Task Image URL</Label>
              <Input
                id="task_image_url"
                type="url"
                value={form.task_image_url}
                onChange={(e) => setForm((f) => ({ ...f, task_image_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
