import { ResumeUploader } from "@/components/resume/resume-uploader";
import { Badge } from "@/components/ui/badge";

export default function ResumePage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Resume Ingestion & Claim Parsing
            </h1>
            <Badge variant="brand" className="text-[11px] font-mono">
              EVAL ENGINE
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Upload technical candidate resumes in PDF or DOCX format to parse skills,
            work histories, and verifiable claim blocks.
          </p>
        </div>
      </div>

      {/* Main Upload Workflow */}
      <ResumeUploader />
    </div>
  );
}
