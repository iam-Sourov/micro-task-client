"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Calendar, User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TaskListPage() {
  const { appUser } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    fetch(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const available = tasks.filter((t) => (t.required_workers ?? 0) > 0);

  if (loading) {
    return <p className="text-muted-foreground">Loading tasks...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Available Tasks</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {available.length === 0 ? (
          <p className="text-muted-foreground col-span-full">No tasks available.</p>
        ) : (
          available.map((task) => (
            <Card key={task._id}>
              <CardContent className="p-4">
                {task.task_image_url && (
                  <img
                    src={task.task_image_url}
                    alt=""
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold truncate">{task.task_title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <User className="h-3 w-3" />
                  {task.buyer_name}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {task.completion_date
                    ? new Date(task.completion_date).toLocaleDateString()
                    : "-"}
                </p>
                <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
                  <Coins className="h-3 w-3" />
                  {task.payable_amount} coins
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {task.required_workers ?? 0} workers needed
                </p>
                <Button asChild className="w-full mt-3" size="sm">
                  <Link href={`/dashboard/task-details/${task._id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
