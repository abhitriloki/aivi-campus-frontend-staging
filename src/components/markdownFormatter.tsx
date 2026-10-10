import React from "react";

interface FormattedTextProps {
  content?: string | null;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content, className = "" }) => {
  if (!content) return null;

  // Clean out any stray markdown codeblock wrappers if present
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```markdown\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/g, "")
    .trim();

  // Split by double newlines or single newlines for block processing
  const lines = cleaned.split(/\r?\n/);

  const processInline = (text: string): React.ReactNode[] => {
    // Regex for bold (**text** or __text__) and italic (*text* or _text_)
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[2] !== undefined) {
        // Bold
        parts.push(
          <strong key={match.index} className="font-semibold text-[#0F172A]">
            {match[2]}
          </strong>
        );
      } else if (match[4] !== undefined) {
        // Italic
        parts.push(
          <em key={match.index} className="italic">
            {match[4]}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className={`space-y-2 leading-relaxed text-[#334155] ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet list item (- or *)
        if (/^[-*]\s+/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^[-*]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 text-sm pl-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D9488]" />
              <div>{processInline(bulletContent)}</div>
            </div>
          );
        }

        // Numbered list item (1. 2.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 text-sm pl-2">
              <span className="font-bold text-[#0D9488] shrink-0">{numMatch[1]}.</span>
              <div>{processInline(numMatch[2])}</div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-sm">
            {processInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedText;
