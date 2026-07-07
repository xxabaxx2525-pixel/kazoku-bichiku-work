(function () {
  "use strict";

  const A4 = { width: 794, height: 1123 };
  const FONT = '"Noto Sans JP", "BIZ UDPGothic", system-ui, sans-serif';

  function wrapLines(context, text, maxWidth) {
    const lines = [];
    let line = "";
    for (const char of String(text)) {
      const candidate = line + char;
      if (line && context.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function makePage() {
    const canvas = document.createElement("canvas");
    canvas.width = A4.width;
    canvas.height = A4.height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#fffefa";
    context.fillRect(0, 0, canvas.width, canvas.height);
    return { canvas, context, y: 82 };
  }

  function addHeader(page, title, brand, dateText) {
    const { context } = page;
    context.fillStyle = "#def3e8";
    context.fillRect(0, 0, A4.width, 116);
    context.fillStyle = "#685f58";
    context.font = `700 15px ${FONT}`;
    context.fillText(brand, 56, 38);
    context.fillStyle = "#075f42";
    context.font = `700 30px ${FONT}`;
    context.fillText(title, 56, 82);
    context.fillStyle = "#685f58";
    context.font = `14px ${FONT}`;
    context.textAlign = "right";
    context.fillText(dateText, A4.width - 56, 38);
    context.textAlign = "left";
    page.y = 154;
  }

  function addSection(page, heading, items, pages, meta) {
    const lineHeight = 31;
    const available = A4.width - 128;
    const needed = 58 + items.reduce((sum, item) => {
      page.context.font = `18px ${FONT}`;
      return sum + wrapLines(page.context, item, available - 34).length * lineHeight + 12;
    }, 0);

    if (page.y + needed > A4.height - 70) {
      page = makePage();
      addHeader(page, meta.title, meta.brand, meta.dateText);
      pages.push(page);
    }

    page.context.fillStyle = "#f3fbf7";
    page.context.fillRect(48, page.y - 12, A4.width - 96, needed);
    page.context.fillStyle = "#087a50";
    page.context.font = `700 22px ${FONT}`;
    page.context.fillText(heading, 64, page.y + 18);
    page.y += 55;

    for (const item of items) {
      page.context.fillStyle = "#087a50";
      page.context.beginPath();
      page.context.arc(70, page.y - 7, 8, 0, Math.PI * 2);
      page.context.fill();
      page.context.fillStyle = "#302a26";
      page.context.font = `18px ${FONT}`;
      const lines = wrapLines(page.context, item, available - 34);
      lines.forEach((line, index) => page.context.fillText(line, 92, page.y + index * lineHeight));
      page.y += lines.length * lineHeight + 12;
    }
    page.y += 24;
    return page;
  }

  function canvasToPngBytes(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error("PDF画像を作成できませんでした"));
        resolve(new Uint8Array(await blob.arrayBuffer()));
      }, "image/png");
    });
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function automaticSave({ title, fileName, data }) {
    if (!window.PDFLib) throw new Error("PDF作成機能を読み込めませんでした");

    const brand = "らりるれ楽家事研究室";
    const now = new Date();
    const dateText = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    const meta = { title, brand, dateText };
    const pages = [makePage()];
    let page = pages[0];
    addHeader(page, title, brand, dateText);

    page.context.fillStyle = "#302a26";
    page.context.font = `700 22px ${FONT}`;
    page.context.fillText("今回の結果", 56, page.y);
    page.y += 48;
    page.context.fillStyle = "#ffe56d";
    page.context.fillRect(56, page.y - 30, A4.width - 112, 92);
    page.context.fillStyle = "#075f42";
    page.context.font = `700 28px ${FONT}`;
    page.context.fillText(data.badge, 82, page.y + 10);
    page.context.textAlign = "right";
    page.context.font = `700 42px ${FONT}`;
    page.context.fillText(`${data.score}%`, A4.width - 82, page.y + 18);
    page.context.textAlign = "left";
    page.y += 104;

    page.context.fillStyle = "#302a26";
    page.context.font = `18px ${FONT}`;
    const messageLines = wrapLines(page.context, data.message, A4.width - 112);
    messageLines.forEach((line, index) => page.context.fillText(line, 56, page.y + index * 31));
    page.y += messageLines.length * 31 + 34;

    page = addSection(page, "できていること", data.strengths, pages, meta);
    page = addSection(page, "整えやすくするポイント", data.improvements, pages, meta);
    addSection(page, "次にやってみること", data.recommendations, pages, meta);

    const pdf = await window.PDFLib.PDFDocument.create();
    for (const rendered of pages) {
      const png = await pdf.embedPng(await canvasToPngBytes(rendered.canvas));
      const pdfPage = pdf.addPage([595.28, 841.89]);
      pdfPage.drawImage(png, { x: 0, y: 0, width: 595.28, height: 841.89 });
    }
    const bytes = await pdf.save();
    downloadBlob(new Blob([bytes], { type: "application/pdf" }), fileName);
  }

  async function save(options) {
    try {
      await automaticSave(options);
      options.onSuccess?.(`「${options.fileName}」を保存しました`);
      return { method: "download" };
    } catch (error) {
      options.onFallback?.("自動保存が使えないため、印刷画面からPDF保存に切り替えます。");
      window.print();
      return { method: "print", error };
    }
  }

  window.RakukajiPdf = { save };
})();
