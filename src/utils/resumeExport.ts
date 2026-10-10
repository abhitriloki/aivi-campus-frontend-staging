import { jsPDF } from "jspdf";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export interface ExportableResumeData {
  personal_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    linkedin_url: string;
    portfolio_url: string;
    location: string;
  };
  summary: string;
  skills: {
    Technical: string[];
    Soft: string[];
    Tools: string[];
  };
  experience: Array<{
    company: string;
    role: string;
    dates: string;
    location: string;
    description: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    dates: string;
    cgpa?: string;
    details: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const slugifyName = (data: ExportableResumeData) => {
  const rawName = `${data.personal_info.first_name || ""} ${data.personal_info.last_name || ""}`.trim();
  return (rawName || "aivi-resume")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const buildContactLine = (data: ExportableResumeData) => {
  return [
    data.personal_info.location,
    data.personal_info.phone,
    data.personal_info.email,
    data.personal_info.linkedin_url,
    data.personal_info.portfolio_url,
  ]
    .filter(Boolean)
    .join(" • ");
};

export const downloadResumePdf = async (
  data: ExportableResumeData,
  options?: { onePage?: boolean; qrToken?: string; collegeName?: string }
) => {
  const isOnePage = Boolean(options?.onePage);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const left = isOnePage ? 36 : 48;
  const right = pageWidth - (isOnePage ? 36 : 48);
  const maxWidth = right - left;
  const bottom = pageHeight - (isOnePage ? 32 : 48);
  let y = isOnePage ? 36 : 56;

  // Stamped QR Barcode seal if qrToken is present
  if (options?.qrToken) {
    try {
      const QRCode = (await import("qrcode")).default;
      const origin = typeof window !== "undefined" ? window.location.origin : "https://aivicampus.com";
      const qrUrl = `${origin}/verifyPublicQrToken?token=${encodeURIComponent(options.qrToken)}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl, { margin: 1, width: 120, errorCorrectionLevel: "M" });
      const qrSize = isOnePage ? 40 : 48;
      const qrX = pageWidth - (isOnePage ? 36 : 48) - qrSize;
      const qrY = isOnePage ? 24 : 36;
      doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text("VERIFIED QR", qrX + qrSize / 2, qrY + qrSize + 7, { align: "center" });
    } catch (e) {
      console.warn("Could not embed QR seal:", e);
    }
  }

  const ensureSpace = (needed = 18) => {
    if (y + needed > bottom && !isOnePage) {
      doc.addPage();
      y = 56;
    }
  };

  const addParagraph = (text: string, fontSize = isOnePage ? 9.5 : 11, lineHeight = isOnePage ? 13 : 16, indent = 0) => {
    if (!text?.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, left + indent, y);
      y += lineHeight;
    }
  };

  const addSectionTitle = (title: string) => {
    ensureSpace(isOnePage ? 18 : 28);
    y += isOnePage ? 3 : 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(isOnePage ? 11 : 13);
    doc.text(title.toUpperCase(), left, y);
    y += isOnePage ? 4 : 8;
    doc.setDrawColor(190, 198, 204);
    doc.line(left, y, right, y);
    y += isOnePage ? 10 : 16;
  };

  const addBullet = (text: string) => {
    if (!text?.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(isOnePage ? 9.5 : 11);
    const bulletLineHeight = isOnePage ? 13 : 16;
    const lines = doc.splitTextToSize(text, maxWidth - (isOnePage ? 14 : 18));
    lines.forEach((line: string, index: number) => {
      ensureSpace(bulletLineHeight);
      if (index === 0) {
        doc.text("•", left + 4, y);
      }
      doc.text(line, left + (isOnePage ? 12 : 16), y);
      y += bulletLineHeight;
    });
  };

  const fullName = `${data.personal_info.first_name || ""} ${data.personal_info.last_name || ""}`.trim() || "Resume Draft";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(isOnePage ? 18 : 24);
  doc.text(fullName.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += isOnePage ? 15 : 20;

  const contactLine = buildContactLine(data);
  if (contactLine) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 99, 107);
    const contactLines = doc.splitTextToSize(contactLine, maxWidth);
    contactLines.forEach((line: string) => {
      ensureSpace(14);
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 14;
    });
    doc.setTextColor(0, 0, 0);
  }
  y += 8;
  doc.setDrawColor(45, 55, 72);
  doc.line(left, y, right, y);
  y += 18;

  if (data.summary) {
    addSectionTitle("Professional Summary");
    addParagraph(data.summary, 11, 17);
  }

  if (data.experience?.length) {
    addSectionTitle("Professional Experience");
    data.experience.forEach((exp) => {
      ensureSpace(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(exp.role || "", left, y);
      if (exp.dates) {
        doc.text(exp.dates, right, y, { align: "right" });
      }
      y += 15;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      const companyLine = [exp.company, exp.location].filter(Boolean).join(" • ");
      if (companyLine) {
        doc.text(companyLine, left, y);
        y += 15;
      }

      exp.description?.forEach((bullet) => addBullet(bullet));
      y += 4;
    });
  }

  if (data.projects?.length) {
    addSectionTitle("Key Projects");
    data.projects.forEach((project) => {
      ensureSpace(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(project.name || "", left, y);
      y += 15;
      addParagraph(project.description, 11, 16);
      if (project.technologies?.length) {
        addParagraph(`Tech Stack: ${project.technologies.join(", ")}`, 10, 15);
      }
      if (project.link) {
        addParagraph(`Link: ${project.link}`, 10, 15);
      }
      y += 4;
    });
  }

  if (data.skills) {
    addSectionTitle("Skills");
    const skillGroups: Array<[string, string[]]> = [
      ["Technical", data.skills.Technical || []],
      ["Tools", data.skills.Tools || []],
      ["Soft Skills", data.skills.Soft || []],
    ];

    skillGroups.forEach(([label, values]) => {
      if (!values.length) return;
      ensureSpace(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${label}:`, left, y);
      doc.setFont("helvetica", "normal");
      const labelWidth = doc.getTextWidth(`${label}: `);
      const lines = doc.splitTextToSize(values.join(", "), maxWidth - labelWidth - 4);
      lines.forEach((line: string, index: number) => {
        ensureSpace(16);
        doc.text(line, index === 0 ? left + labelWidth + 4 : left + labelWidth + 4, y);
        y += 16;
      });
    });
  }

  if (data.education?.length) {
    addSectionTitle("Education");
    data.education.forEach((edu) => {
      ensureSpace(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(edu.school || "", left, y);
      if (edu.dates) {
        doc.text(edu.dates, right, y, { align: "right" });
      }
      y += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const degreeLine = [edu.degree, edu.field].filter(Boolean).join(", ");
      if (degreeLine) {
        doc.text(degreeLine, left, y);
        if (edu.cgpa) {
          doc.text(edu.cgpa, right, y, { align: "right" });
        }
        y += 15;
      } else if (edu.cgpa) {
        doc.text(edu.cgpa, left, y);
        y += 15;
      }
      edu.details?.forEach((detail) => addBullet(detail));
      y += 4;
    });
  }

  if (data.certifications?.length) {
    addSectionTitle("Certifications");
    data.certifications.forEach((cert) => {
      ensureSpace(16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const line = `${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ""}${cert.date ? ` (${cert.date})` : ""}`;
      addParagraph(line, 11, 16);
    });
  }

  doc.save(`${slugifyName(data)}.pdf`);
};

const paragraph = (text: string, options?: ConstructorParameters<typeof Paragraph>[0]) =>
  new Paragraph({
    children: [new TextRun(text)],
    ...options,
  });

export const downloadResumeDocx = async (data: ExportableResumeData) => {
  const children: Paragraph[] = [];
  const fullName = `${data.personal_info.first_name || ""} ${data.personal_info.last_name || ""}`.trim() || "Resume Draft";

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [
        new TextRun({
          text: fullName.toUpperCase(),
          bold: true,
          size: 30,
        }),
      ],
      spacing: { after: 120 },
    })
  );

  const contactLine = buildContactLine(data);
  if (contactLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactLine,
            size: 20,
            color: "5A636B",
          }),
        ],
        spacing: { after: 220 },
      })
    );
  }

  const addHeading = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 120, after: 80 },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
          }),
        ],
      })
    );
  };

  if (data.summary) {
    addHeading("Professional Summary");
    children.push(paragraph(data.summary, { spacing: { after: 140 } }));
  }

  if (data.experience?.length) {
    addHeading("Professional Experience");
    data.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: exp.role || "", bold: true, size: 22 }),
            new TextRun({ text: exp.dates ? `    ${exp.dates}` : "", size: 20 }),
          ],
        })
      );
      const companyLine = [exp.company, exp.location].filter(Boolean).join(" • ");
      if (companyLine) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: companyLine, italics: true, size: 20 })],
          })
        );
      }
      exp.description?.forEach((bullet) => {
        children.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      });
      children.push(paragraph("", { spacing: { after: 60 } }));
    });
  }

  if (data.projects?.length) {
    addHeading("Key Projects");
    data.projects.forEach((project) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: project.name || "", bold: true, size: 22 })],
        })
      );
      if (project.description) {
        children.push(paragraph(project.description, { spacing: { after: 50 } }));
      }
      if (project.technologies?.length) {
        children.push(
          paragraph(`Tech Stack: ${project.technologies.join(", ")}`, {
            spacing: { after: 40 },
          })
        );
      }
      if (project.link) {
        children.push(paragraph(`Link: ${project.link}`, { spacing: { after: 60 } }));
      }
    });
  }

  if (data.skills) {
    addHeading("Skills");
    const skillGroups: Array<[string, string[]]> = [
      ["Technical", data.skills.Technical || []],
      ["Tools", data.skills.Tools || []],
      ["Soft Skills", data.skills.Soft || []],
    ];
    skillGroups.forEach(([label, values]) => {
      if (!values.length) return;
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${label}: `, bold: true }),
            new TextRun(values.join(", ")),
          ],
        })
      );
    });
  }

  if (data.education?.length) {
    addHeading("Education");
    data.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: edu.school || "", bold: true, size: 22 }),
            new TextRun({ text: edu.dates ? `    ${edu.dates}` : "", size: 20 }),
          ],
        })
      );
      const degreeParts = [edu.degree, edu.field].filter(Boolean);
      if (edu.cgpa) degreeParts.push(`(${edu.cgpa})`);
      const degreeLine = degreeParts.join(", ");
      if (degreeLine) {
        children.push(paragraph(degreeLine, { spacing: { after: 60 } }));
      }
      edu.details?.forEach((detail) => {
        children.push(
          new Paragraph({
            text: detail,
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      });
      children.push(paragraph("", { spacing: { after: 60 } }));
    });
  }

  if (data.certifications?.length) {
    addHeading("Certifications");
    data.certifications.forEach((cert) => {
      const line = `${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ""}${cert.date ? ` (${cert.date})` : ""}`;
      children.push(paragraph(line, { spacing: { after: 50 } }));
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${slugifyName(data)}.docx`);
};
