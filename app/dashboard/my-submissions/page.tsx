"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const PAGE_SIZE = 10;

export default function MySubmissionsPage() {
  const { appUser } = useAuth();
  const [data, setData] = useState<{ submissions: any[]; total: number }>({
    submissions: [],
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
    if (!token || !appUser?.email) return;
    setLoading(true);
    fetch(
      `${API_URL}/submissions-worker/${encodeURIComponent(appUser.email)}?page=${page}&limit=${PAGE_SIZE}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((r) => r.json())
      .then((res) =>
        setData({
          submissions: res.submissions ?? [],
          total: res.total ?? 0,
        })
      )
      .catch(() => setData({ submissions: [], total: 0 }))
      .finally(() => setLoading(false));
  }, [appUser?.email, page]);

  const totalPages = Math.ceil(data.total / PAGE_SIZE) || 1;

  if (loading && data.submissions.length === 0) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Submissions</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Task Title</th>
              <th className="text-left p-3">Buyer</th>
              <th className="text-left p-3">Payable</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              data.submissions.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.task_title}</td>
                  <td className="p-3">{s.buyer_name}</td>
                  <td className="p-3">{s.payable_amount} coins</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        s.status === "approved"
                          ? "default"
                          : s.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {s.current_date
                      ? new Date(s.current_date).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
