import type { JobAttachment } from "@/types";
import { cn } from "@/lib/utils";

interface AttachmentGridProps {
  attachments: JobAttachment[];
  uploading?: boolean;
}

function getFileIcon(fileType: string | null) {
  if (!fileType) return "📄";
  if (fileType.startsWith("image/")) return "🖼️";
  if (fileType.includes("pdf")) return "📕";
  if (fileType.includes("word") || fileType.includes("document")) return "📘";
  if (fileType.includes("zip") || fileType.includes("rar")) return "📦";
  return "📄";
}

export default function AttachmentGrid({ attachments, uploading }: AttachmentGridProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {attachments.map((att) => (
          <a
            key={att.id}
            href={att.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-surface-raised p-3 rounded-[8px] hover:border-[var(--border-active)] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getFileIcon(att.file_type)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[var(--text-primary)] truncate">{att.file_name}</p>
                <p className={cn(
                  "text-[10px] font-medium mt-0.5",
                  att.uploader === "client" ? "text-blue-400" : "text-[var(--text-muted)]"
                )}>
                  {att.uploader === "client" ? "Client" : "Staff"}
                </p>
              </div>
            </div>
          </a>
        ))}
        {uploading && (
          <div className="card-surface-raised p-3 rounded-[8px] flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </div>
          </div>
        )}
      </div>
      {attachments.length === 0 && !uploading && (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">No attachments yet</p>
      )}
    </div>
  );
}
