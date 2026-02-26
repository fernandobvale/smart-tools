import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

function normalizeDocxColor(value: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("#") && value.length === 7) return value.substring(1);
  if (value.startsWith("#") && value.length === 4) {
    const [, r, g, b] = value;
    return `${r}${r}${g}${g}${b}${b}`;
  }
  const rgbMatch = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
      .map((v) => parseInt(v, 10).toString(16).padStart(2, "0"))
      .join("");
  }
  return undefined;
}

const HEADING_MAP: Record<string, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  H1: HeadingLevel.HEADING_1,
  H2: HeadingLevel.HEADING_2,
  H3: HeadingLevel.HEADING_3,
  H4: HeadingLevel.HEADING_4,
  H5: HeadingLevel.HEADING_5,
  H6: HeadingLevel.HEADING_6,
};

interface RunOptions {
  bold?: boolean;
  italics?: boolean;
  underline?: { type: "single" };
  subScript?: boolean;
  superScript?: boolean;
  color?: string;
}

function getAlignment(element: Element): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  const style = element.getAttribute("style") || "";
  if (style.includes("text-align: center")) return AlignmentType.CENTER;
  if (style.includes("text-align: right")) return AlignmentType.RIGHT;
  if (style.includes("text-align: justify")) return AlignmentType.JUSTIFIED;
  return undefined;
}

function extractRuns(node: Node, inherited: RunOptions = {}): TextRun[] {
  const runs: TextRun[] = [];

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent || "";
      if (text) {
        runs.push(new TextRun({ text, ...inherited }));
      }
      return;
    }

    if (child.nodeType !== Node.ELEMENT_NODE) return;

    const el = child as Element;
    const tag = el.tagName;
    const opts: RunOptions = { ...inherited };

    if (tag === "STRONG" || tag === "B") opts.bold = true;
    if (tag === "EM" || tag === "I") opts.italics = true;
    if (tag === "U") opts.underline = { type: "single" };
    if (tag === "SUB") opts.subScript = true;
    if (tag === "SUP") opts.superScript = true;

    if (tag === "SPAN") {
      const style = el.getAttribute("style") || "";
      const colorMatch = style.match(/color:\s*([^;]+)/);
      if (colorMatch) {
        const normalized = normalizeDocxColor(colorMatch[1].trim());
        if (normalized) opts.color = normalized;
      }
    }

    if (tag === "BR") {
      runs.push(new TextRun({ text: "", break: 1 }));
      return;
    }

    if (tag === "A") {
      // Links are handled at paragraph level via ExternalHyperlink
      const text = el.textContent || "";
      runs.push(new TextRun({ text, ...opts, style: "Hyperlink" }));
      return;
    }

    runs.push(...extractRuns(el, opts));
  });

  return runs;
}

function parseElement(element: Element): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const tag = element.tagName;

  // Headings
  if (HEADING_MAP[tag]) {
    const alignment = getAlignment(element);
    const children = extractRuns(element);
    paragraphs.push(
      new Paragraph({
        heading: HEADING_MAP[tag],
        children,
        ...(alignment ? { alignment } : {}),
      })
    );
    return paragraphs;
  }

  // Paragraphs
  if (tag === "P") {
    const alignment = getAlignment(element);
    const children = extractRuns(element);
    paragraphs.push(
      new Paragraph({
        children,
        ...(alignment ? { alignment } : {}),
      })
    );
    return paragraphs;
  }

  // Lists (UL / OL)
  if (tag === "UL" || tag === "OL") {
    element.querySelectorAll(":scope > li").forEach((li) => {
      const children = extractRuns(li);
      paragraphs.push(
        new Paragraph({
          children,
          bullet: tag === "UL" ? { level: 0 } : undefined,
          numbering: tag === "OL" ? { reference: "default-numbering", level: 0 } : undefined,
        })
      );
    });
    return paragraphs;
  }

  // Blockquote
  if (tag === "BLOCKQUOTE") {
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        paragraphs.push(...parseElement(child as Element));
      }
    });
    return paragraphs;
  }

  // Fallback: treat as paragraph
  const text = element.textContent || "";
  if (text.trim()) {
    paragraphs.push(new Paragraph({ children: extractRuns(element) }));
  }

  return paragraphs;
}

export function htmlToDocx(html: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const paragraphs: Paragraph[] = [];

  body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      paragraphs.push(...parseElement(node as Element));
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      paragraphs.push(
        new Paragraph({ children: [new TextRun(node.textContent)] })
      );
    }
  });

  // Ensure at least one paragraph
  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({}));
  }

  return new Document({
    numbering: {
      config: [
        {
          reference: "default-numbering",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [{ children: paragraphs }],
  });
}
