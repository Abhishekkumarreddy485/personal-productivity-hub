// /backend/utils/exporters.js
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

exports.generateCSVBuffer = async (book, quotes) => {
  const fields = ['index', 'text', 'favorite', 'createdAt'];
  const data = quotes.map((q, idx) => ({
    index: idx + 1,
    text: q.text,
    favorite: q.favorite ? 'yes' : 'no',
    createdAt: q.createdAt.toISOString()
  }));
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  return Buffer.from(csv, 'utf8');
};

exports.generatePDFBuffer = async (book, quotes) => {
  const doc = new PDFDocument({ margin: 40 });
  const writable = new streamBuffers.WritableStreamBuffer();

  doc.pipe(writable);

  doc.fontSize(20).text(book.title || 'Quotes', { underline: true });
  doc.moveDown();
  if (book.author) doc.fontSize(12).text(`Author: ${book.author}`);
  doc.moveDown();

  quotes.forEach((q, idx) => {
    doc.fontSize(11).text(`${idx + 1}. ${q.text}`, { paragraphGap: 8 });
  });

  doc.end();

  return new Promise((resolve, reject) => {
    writable.on('finish', () => {
      const buffer = writable.getContents();
      resolve(buffer);
    });
    writable.on('error', reject);
  });
};
