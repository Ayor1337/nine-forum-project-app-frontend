import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "./style/quillText.css";

export function quillToHTML(quillText: string): string {
  const delta = JSON.parse(quillText);

  const ops = (delta?.ops ?? []).map((op: any) => {
    if (op.insert && typeof op.insert === "object") {
      op.insert.image = "http://localhost:9000/" + op.insert.image;
    }

    return op;
  });

  const converter = new QuillDeltaToHtmlConverter(ops, {
    paragraphTag: "p", // 段落标签
    linkRel: "noopener noreferrer",
    linkTarget: "_blank",
  });
  return converter.convert();
}
