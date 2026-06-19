"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Pill,
  ClipboardList,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ReportTemplateType } from "@/api/medicalHistory";

interface SmartReportEditorProps {
  report: string;
  onReportChange: (value: string) => void;
  onGenerateTemplate: (template: ReportTemplateType) => void;
  isGenerating: boolean;
  generatingTemplate?: ReportTemplateType | null;
  onSave: () => void;
  isSaving: boolean;
  patientName: string;
}

const templates: Array<{
  id: ReportTemplateType;
  label: string;
  description: string;
  icon: typeof Pill;
}> = [
  {
    id: "prescription",
    label: "Smart Prescription",
    description: "AI draft Rx based on history & weight",
    icon: Pill,
  },
  {
    id: "clinical_note",
    label: "Clinical Note (SOAP)",
    description: "Structured consultation draft",
    icon: ClipboardList,
  },
  {
    id: "follow_up",
    label: "Follow-up Plan",
    description: "Care instructions & monitoring",
    icon: FileText,
  },
];

export function SmartReportEditor({
  report,
  onReportChange,
  onGenerateTemplate,
  isGenerating,
  generatingTemplate,
  onSave,
  isSaving,
  patientName,
}: SmartReportEditorProps) {
  return (
    <div className="flex h-full min-h-[600px] flex-col rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">
            Smart Report Editor
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Document consultation for {patientName}
        </p>
      </div>

      <div className="border-b border-border px-5 py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          AI Report Templates
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            const loading =
              isGenerating && generatingTemplate === tpl.id;
            return (
              <Button
                key={tpl.id}
                type="button"
                variant="outline"
                className="h-auto flex-col items-start gap-1 px-3 py-3 text-left"
                disabled={isGenerating}
                onClick={() => onGenerateTemplate(tpl.id)}
              >
                <div className="flex w-full items-center gap-2">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Icon className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm font-medium">{tpl.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {tpl.description}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <Label htmlFor="report-editor">Consultation Report / Prescription</Label>
          <Badge variant="secondary">Editable draft</Badge>
        </div>
        <Textarea
          id="report-editor"
          value={report}
          onChange={(e) => onReportChange(e.target.value)}
          placeholder="Write diagnosis, clinical notes, medications, and follow-up instructions — or generate a draft using the templates above..."
          className="min-h-[320px] flex-1 resize-none font-mono text-sm leading-relaxed"
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button
            className="gradient-primary border-0"
            onClick={onSave}
            disabled={!report.trim() || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save report & complete visit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
