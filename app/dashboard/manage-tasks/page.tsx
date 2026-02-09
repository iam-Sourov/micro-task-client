"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function ManageTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadTasks = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    fetch(`${API_URL}/tasks-admin`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const deleteTask = async (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    const res = await fetch(`${API_URL}/tasks-admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setDeleteId(null);
      loadTasks();
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Tasks</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Buyer</th>
              <th className="text-left p-3">Required Workers</th>
              <th className="text-left p-3">Payable</th>
              <th className="text-left p-3">Deadline</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No tasks.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="border-t">
                  <td className="p-3 max-w-[200px] truncate">{task.task_title}</td>
                  <td className="p-3">{task.buyer_name}</td>
                  <td className="p-3">{task.required_workers}</td>
                  <td className="p-3">{task.payable_amount} coins</td>
                  <td className="p-3">
                    {task.completion_date
                      ? new Date(task.completion_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(task._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Task
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the task from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && deleteTask(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
