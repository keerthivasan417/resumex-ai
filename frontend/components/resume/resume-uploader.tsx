"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type UploadStep = "idle" | "selected" | "uploading" | "ready";

interface SelectedFileInfo {
  file: File;
  name: string;
  sizeFormatted: string;
  typeFormatted: string;
  lastModifiedFormatted: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export function ResumeUploader() {
  const [step, setStep] = React.useState<UploadStep>("idle");
  const [isDragging, setIsDragging] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState<SelectedFileInfo | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [progressStage, setProgressStage] = React.useState("Ingesting document...");
  const [analysisTriggered, setAnalysisTriggered] = React.useState(false);

  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format file type
  const formatFileType = (file: File): string => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || file.type === "application/pdf") return "PDF Document";
    if (
      ext === "docx" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "Microsoft Word (DOCX)";
    }
    return file.type || "Document";
  };

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
    const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!isAllowedExt && !isAllowedMime) {
      return {
        valid: false,
        error: `Unsupported file format (${ext || "unknown"}). Only PDF and DOCX files are accepted.`,
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File exceeds maximum limit of 10 MB (Selected: ${formatFileSize(file.size)}). Please compress or reduce the file size.`,
      };
    }

    if (file.size === 0) {
      return {
        valid: false,
        error: "The selected file is empty (0 bytes). Please select a valid document.",
      };
    }

    return { valid: true };
  };

  // Handle incoming file selection
  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    setDuplicateNotice(null);

    // Check for duplicate selection
    if (fileInfo && fileInfo.name === file.name && fileInfo.file.size === file.size) {
      setDuplicateNotice(`"${file.name}" is already selected.`);
      return;
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file selected.");
      return;
    }

    setFileInfo({
      file,
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      typeFormatted: formatFileType(file),
      lastModifiedFormatted: new Date(file.lastModified).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    });
    setStep("selected");
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Manual file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFileInfo(null);
    setErrorMessage(null);
    setDuplicateNotice(null);
    setUploadProgress(0);
    setAnalysisTriggered(false);
    setStep("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Replace file
  const handleReplaceFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Start upload / processing simulation (local state only, ready for future API integration)
  const handleStartUpload = () => {
    setStep("uploading");
    setUploadProgress(10);
    setProgressStage("Uploading document to ingestion buffer...");

    const t1 = setTimeout(() => {
      setUploadProgress(45);
      setProgressStage("Extracting text and formatting layers...");
    }, 450);

    const t2 = setTimeout(() => {
      setUploadProgress(80);
      setProgressStage("Verifying document structure & sections...");
    }, 900);

    const t3 = setTimeout(() => {
      setUploadProgress(100);
      setProgressStage("Ingestion complete. Ready for claim analysis.");
      setStep("ready");
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  return (
    <div className="space-y-6">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileInputChange}
        className="hidden"
        id="resume-file-input"
      />

      {/* Validation Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-xs"
        >
          <div className="flex items-start gap-2.5">
            <Icons.alertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Validation Error</p>
              <p className="text-xs text-red-800 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900 p-1 rounded-md hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <Icons.x className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Duplicate Notice Banner */}
      {duplicateNotice && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Icons.alertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium">{duplicateNotice}</p>
          </div>
          <button
            type="button"
            onClick={() => setDuplicateNotice(null)}
            className="text-amber-700 hover:text-amber-900 p-0.5 rounded"
            aria-label="Dismiss notice"
          >
            <Icons.x className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Step 1: IDLE DROPZONE */}
      {step === "idle" && (
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={cn(
              "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2",
              isDragging
                ? "border-brand-600 bg-brand-50/60 scale-[0.99]"
                : "border-zinc-300 bg-zinc-50/50 hover:border-brand-500 hover:bg-zinc-50"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-xs text-zinc-600 group-hover:text-brand-600 group-hover:border-brand-200 transition-colors">
              <Icons.upload className="h-6 w-6" />
            </div>

            <div className="mt-4 space-y-1.5">
              <p className="text-sm font-semibold text-zinc-900">
                <span className="text-brand-700 underline underline-offset-2">
                  Click to select resume
                </span>{" "}
                or drag and drop file here
              </p>
              <p className="text-xs text-zinc-500">
                Accepted formats: PDF (.pdf) or Microsoft Word (.docx)
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="neutral" className="text-[11px] font-mono">
                MAX 10 MB
              </Badge>
              <Badge variant="brand" className="text-[11px] font-mono">
                PDF & DOCX
              </Badge>
              <Badge variant="outline" className="text-[11px] font-mono">
                TEXT LAYER REQUIRED
              </Badge>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <Card className="border-zinc-200">
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-zinc-900">
                  <Icons.checkCircle className="h-3.5 w-3.5 text-brand-600" />
                  <span>Standard Headings</span>
                </div>
                <p className="text-zinc-500 leading-relaxed">
                  Use conventional sections like Experience, Education, Skills, and Projects for optimal AST parsing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-zinc-900">
                  <Icons.code className="h-3.5 w-3.5 text-brand-600" />
                  <span>Verifiable Links</span>
                </div>
                <p className="text-zinc-500 leading-relaxed">
                  Include GitHub repositories or public project links to enable deterministic code-claim verification.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-zinc-900">
                  <Icons.shieldCheck className="h-3.5 w-3.5 text-brand-600" />
                  <span>Private Ingestion</span>
                </div>
                <p className="text-zinc-500 leading-relaxed">
                  Resumes are parsed securely for claim extraction without persistent document data sharing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: FILE SELECTED STATE */}
      {step === "selected" && fileInfo && (
        <Card className="border-zinc-200 shadow-xs">
          <CardHeader className="p-6 pb-4 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-zinc-900">
                  Document Ready for Ingestion
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 mt-1">
                  File meets format and size parameters. Confirm to proceed with text parsing and section extraction.
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs">
                Format Validated
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* File Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md border border-zinc-200 bg-zinc-50/70">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white border border-zinc-200 text-brand-700">
                  <Icons.fileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {fileInfo.name}
                  </p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    {fileInfo.typeFormatted} • {fileInfo.sizeFormatted} • Modified {fileInfo.lastModifiedFormatted}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplaceFile}
                  className="text-xs"
                >
                  <Icons.refresh className="mr-1.5 h-3.5 w-3.5" />
                  Replace
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-xs text-zinc-600 hover:text-red-700"
                >
                  <Icons.trash className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Ingestion Parameters Confirmation */}
            <div className="rounded-md border border-zinc-200 p-4 bg-white space-y-2 text-xs">
              <div className="font-semibold text-zinc-900">Ingestion Targets:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-600">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>Technical skill extraction (languages, stacks, protocols)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>Chronological role & tenure attribution</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>Empirical project & repository URL discovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>Candidate accomplishment claim segmentation</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 border-t border-zinc-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleStartUpload}
            >
              <Icons.upload className="mr-1.5 h-3.5 w-3.5" />
              Upload & Extract Claims
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: UPLOADING & INGESTION PROGRESS */}
      {step === "uploading" && fileInfo && (
        <Card className="border-zinc-200 shadow-xs">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-zinc-900">
                Processing Document
              </CardTitle>
              <span className="font-mono text-xs text-brand-700 font-semibold">
                {uploadProgress}%
              </span>
            </div>
            <CardDescription className="text-xs text-zinc-500">
              {progressStage}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-4">
            <Progress value={uploadProgress} className="h-2" />

            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <div className="flex items-center gap-2">
                <Icons.spinner className="h-3.5 w-3.5 text-brand-600" />
                <span>{fileInfo.name}</span>
              </div>
              <span>{fileInfo.sizeFormatted}</span>
            </div>

            {/* Stage Indicators */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
              <div
                className={cn(
                  "p-2 rounded border text-center transition-colors",
                  uploadProgress >= 30
                    ? "border-brand-200 bg-brand-50 text-brand-900 font-medium"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400"
                )}
              >
                1. Intake Buffer
              </div>
              <div
                className={cn(
                  "p-2 rounded border text-center transition-colors",
                  uploadProgress >= 70
                    ? "border-brand-200 bg-brand-50 text-brand-900 font-medium"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400"
                )}
              >
                2. Text Extraction
              </div>
              <div
                className={cn(
                  "p-2 rounded border text-center transition-colors",
                  uploadProgress >= 100
                    ? "border-brand-200 bg-brand-50 text-brand-900 font-medium"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400"
                )}
              >
                3. Structure Validation
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: READY TO ANALYZE STATE */}
      {step === "ready" && fileInfo && (
        <Card className="border-zinc-200 shadow-xs">
          <CardHeader className="p-6 border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <CardTitle className="text-base font-semibold text-zinc-900">
                    Ingestion Complete & Verified
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-zinc-500 mt-1">
                  Document has been processed into structured sections and parsed technical blocks.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs font-mono">
                  READY FOR EVALUATION
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Document Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-md border border-zinc-200 bg-zinc-50 text-xs">
              <div>
                <span className="text-zinc-400 font-mono block">Document Name</span>
                <span className="font-semibold text-zinc-900 truncate block mt-0.5" title={fileInfo.name}>
                  {fileInfo.name}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 font-mono block">Format & Size</span>
                <span className="font-medium text-zinc-800 block mt-0.5">
                  {fileInfo.typeFormatted.split(" ")[0]} • {fileInfo.sizeFormatted}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 font-mono block">Ingestion Status</span>
                <span className="font-medium text-emerald-700 block mt-0.5">
                  Text Layer Extracted
                </span>
              </div>
              <div>
                <span className="text-zinc-400 font-mono block">Section Segments</span>
                <span className="font-mono font-medium text-zinc-800 block mt-0.5">
                  4 Detected Blocks
                </span>
              </div>
            </div>

            {/* Extracted Sections Preview Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900 uppercase tracking-wider font-mono">
                  Detected Document Sections
                </span>
                <span className="text-zinc-400 font-mono">Structure Audit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-md border border-zinc-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-900">Work Experience</span>
                    <Badge variant="neutral" className="text-[10px]">Parsed</Badge>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Chronological positions, engineering responsibilities, and team impact points.
                  </p>
                </div>

                <div className="p-3 rounded-md border border-zinc-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-900">Technical Competencies</span>
                    <Badge variant="neutral" className="text-[10px]">Extracted</Badge>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Languages, database systems, distributed architectures, and tools.
                  </p>
                </div>

                <div className="p-3 rounded-md border border-zinc-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-900">Project Claims</span>
                    <Badge variant="neutral" className="text-[10px]">Identified</Badge>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Specific project deliverables eligible for source-code evidence verification.
                  </p>
                </div>

                <div className="p-3 rounded-md border border-zinc-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-900">Education & Credentials</span>
                    <Badge variant="neutral" className="text-[10px]">Verified</Badge>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Institutions, degrees, and certified engineering accreditations.
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis State Notice */}
            {analysisTriggered && (
              <div className="p-4 rounded-md border border-brand-200 bg-brand-50/60 text-xs text-brand-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                  <span>
                    Resume claim analysis pipeline initialized. Navigate to{" "}
                    <strong>Skills</strong> or <strong>Evidence Ledger</strong> to inspect verified claims.
                  </span>
                </div>
                <Link href="/app/skills">
                  <Button size="sm" variant="default" className="text-xs h-7">
                    View Skills
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-6 pt-0 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplaceFile}
                className="w-full sm:w-auto"
              >
                <Icons.refresh className="mr-1.5 h-3.5 w-3.5" />
                Upload Another Resume
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="w-full sm:w-auto text-zinc-600"
              >
                Reset
              </Button>
            </div>

            <Button
              size="md"
              onClick={() => {
                setAnalysisTriggered(true);
                router.push("/app/skills");
              }}
              className="w-full sm:w-auto"
            >
              <Icons.cpu className="mr-2 h-4 w-4" />
              Analyze Resume Claims
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
