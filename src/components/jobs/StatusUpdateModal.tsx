"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { getValidNextStatuses, getStatusLabel } from "@/lib/utils";
import type { JobStatus } from "@/types";

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: JobStatus;
  onConfirm: (status: JobStatus, notes?: string) => Promise<void>;
}

export default function StatusUpdateModal({ isOpen, onClose, currentStatus, onConfirm }: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const validStatuses = getValidNextStatuses(currentStatus);

  const handleSubmit = async () => {
    if (!selectedStatus) return;
    setLoading(true);
    try {
      await onConfirm(selectedStatus as JobStatus, notes || undefined);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Job Status">
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-muted)]">
          Current status: <span className="text-[var(--text-primary)] font-medium">{getStatusLabel(currentStatus)}</span>
        </p>
        <Select
          label="New Status"
          placeholder="Select new status..."
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as JobStatus)}
          options={validStatuses.map((s) => ({ value: s, label: getStatusLabel(s) }))}
        />
        <Textarea
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this status change..."
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!selectedStatus}>
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
