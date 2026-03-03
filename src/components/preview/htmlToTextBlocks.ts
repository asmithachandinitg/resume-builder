/**
 * Converts HTML from the rich-text editor into react-pdf text blocks.
 *
 * Handles ALL common editor outputs:
 *   <ul><li>…</li></ul>   → bullet points
 *   <ol><li>…</li></ol>   → bullet points
 *   <p>…</p>              → paragraph (one block per <p>)
 *   <strong> / <b>        → bold flag
 *   <em> / <i>            → italic flag
 *   plain text            → single block
 *
 * Each <p> becomes its OWN block (fixes the "run together" issue).
 */

export type TextBlock = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  bullet?: boolean;
};

export function htmlToTextBlocks(html: string): TextBlock[] {
  if (!html || !html.trim()) return [];

  const blocks: TextBlock[] = [];

  // 1. Normalize entities and line breaks
  html = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<br\s*\/?>/gi, "\n");

  // 2. Split into segments: list blocks vs non-list HTML
  type Seg = { type: "ul" | "ol" | "html"; content: string };
  const segments: Seg[] = [];
  const listRe = /<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = listRe.exec(html)) !== null) {
    if (m.index > last) {
      segments.push({ type: "html", content: html.slice(last, m.index) });
    }
    segments.push({ type: m[1].toLowerCase() as "ul" | "ol", content: m[2] });
    last = m.index + m[0].length;
  }
  if (last < html.length) {
    segments.push({ type: "html", content: html.slice(last) });
  }

  // 3. Process each segment
  for (const seg of segments) {

    if (seg.type === "ul" || seg.type === "ol") {
      // Each <li> → bullet block
      const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liM: RegExpExecArray | null;
      while ((liM = liRe.exec(seg.content)) !== null) {
        const inner = liM[1];
        const text = stripTags(inner).trim();
        if (text) {
          blocks.push({ text, bullet: true, bold: hasBold(inner), italic: hasItalic(inner) });
        }
      }

    } else {
      // Non-list HTML: extract each <p> as its own block
      const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pM: RegExpExecArray | null;
      let foundP = false;

      while ((pM = pRe.exec(seg.content)) !== null) {
        foundP = true;
        const inner = pM[1].trim();
        if (!inner) continue;

        // Check if this <p> itself contains a <ul>/<ol> (nested list inside p — rare but possible)
        if (/<ul|<ol/i.test(inner)) {
          // Recurse into it
          const nested = htmlToTextBlocks(inner);
          blocks.push(...nested);
        } else {
          const text = stripTags(inner).trim();
          if (text) {
            blocks.push({ text, bold: hasBold(inner), italic: hasItalic(inner) });
          }
        }
      }

      if (!foundP) {
        // No <p> tags — plain text, split by newline
        const text = stripTags(seg.content).trim();
        if (text) {
          for (const line of text.split("\n").map(l => l.trim()).filter(Boolean)) {
            blocks.push({ text: line, bold: hasBold(seg.content), italic: hasItalic(seg.content) });
          }
        }
      }
    }
  }

  return blocks;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasBold(html: string): boolean {
  return /<strong[\s>]|<strong>|<b[\s>]|<b>/i.test(html);
}

function hasItalic(html: string): boolean {
  return /<em[\s>]|<em>|<i[\s>]|<i>/i.test(html);
}
