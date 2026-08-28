interface BPMNPDFViewerProps {
  pdfSrc: string;
  title?: string;
}

export function BPMNPDFViewer({ pdfSrc, title = "BPMN Diagram" }: BPMNPDFViewerProps) {
  return (
    <div className="flex-1 relative overflow-hidden bg-slate-200">
      <iframe
        src={`${pdfSrc}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
        title={title}
        className="w-full h-full border-0"
        style={{
          minHeight: '100%',
        }}
      />
    </div>
  );
}
