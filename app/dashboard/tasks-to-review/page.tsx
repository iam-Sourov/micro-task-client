"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TasksToReviewPage() {
  const { appUser } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<any | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);

  const loadSubmissions = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser?.email) return;
    fetch(`${API_URL}/submissions-buyer/${encodeURIComponent(appUser.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubmissions();
  }, [appUser?.email]);

  const approve = async (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    setActioning(id);
    try {
      const res = await fetch(`${API_URL}/submissions/approve/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setViewing(null);
        loadSubmissions();
      }
    } finally {
      setActioning(null);
    }
  };

  const reject = async (id: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token) return;
    setActioning(id);
    try {
      const res = await fetch(`${API_URL}/submissions/reject/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setViewing(null);
        loadSubmissions();
      }
    } finally {
      setActioning(null);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Task To Review</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Worker</th>
              <th className="text-left p-3">Task Title</th>
              <th className="text-left p-3">Payable Amount</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No pending submissions.
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.worker_name}</td>
                  <td className="p-3">{s.task_title}</td>
                  <td className="p-3">{s.payable_amount} coins</td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewing(s)}
                    >
                      View Submission
                    </Button>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => approve(s._id)}
                        disabled={actioning === s._id}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => reject(s._id)}
                        disabled={actioning === s._id}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewing(null)}>
          <div className="bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4 text-left" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-4">Submission Detail</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Worker:</strong> {viewing.worker_name}</p>
              <p><strong>Task:</strong> {viewing.task_title}</p>
              <p><strong>Payable:</strong> {viewing.payable_amount} coins</p>
              <p><strong>Details:</strong></p>
              <p className="whitespace-pre-wrap bg-muted p-2 rounded text-sm">
                {viewing.submission_details || "-"}
              </p>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
              <Button onClick={() => approve(viewing._id)} disabled={actioning === viewing._id}>Approve</Button>
              <Button variant="destructive" onClick={() => reject(viewing._id)} disabled={actioning === viewing._id}>Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
