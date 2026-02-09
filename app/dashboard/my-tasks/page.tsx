"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
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
import { Pencil, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function MyTasksPage() {
  const { appUser } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadTasks = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser?.email) return;
    fetch(`${API_URL}/tasks-buyer/${encodeURIComponent(appUser.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [appUser?.email]);

  const handleUpdate = async (taskId: string, updates: { task_title?: string; task_detail?: string; submission_info?: string }) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      setEditing(null);
      loadTasks();
    }
  };

  const handleDelete = async (taskId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
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
      <h1 className="text-2xl font-bold">My Tasks</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Required Workers</th>
              <th className="text-left p-3">Payable</th>
              <th className="text-left p-3">Deadline</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No tasks yet.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="border-t">
                  <td className="p-3">{task.task_title}</td>
                  <td className="p-3">{task.required_workers}</td>
                  <td className="p-3">{task.payable_amount} coins</td>
                  <td className="p-3">
                    {task.completion_date
                      ? new Date(task.completion_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditing({
                          _id: task._id,
                          task_title: task.task_title,
                          task_detail: task.task_detail,
                          submission_info: task.submission_info,
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(task._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditTaskModal
          task={editing}
          onSave={(updates) => handleUpdate(editing._id, updates)}
          onClose={() => setEditing(null)}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will refund coins for uncompleted workers. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EditTaskModal({
  task,
  onSave,
  onClose,
}: {
  task: { task_title: string; task_detail: string; submission_info: string };
  onSave: (u: { task_title: string; task_detail: string; submission_info: string }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task.task_title);
  const [detail, setDetail] = useState(task.task_detail);
  const [submissionInfo, setSubmissionInfo] = useState(task.submission_info);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-semibold mb-4">Update Task</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Task Detail</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Submission Info</label>
            <input
              type="text"
              value={submissionInfo}
              onChange={(e) => setSubmissionInfo(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => onSave({ task_title: title, task_detail: detail, submission_info: submissionInfo })}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
