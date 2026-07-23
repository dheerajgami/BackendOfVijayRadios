import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

export const generateInvoicePDF = (order, trackingId) => {
  return new Promise((resolve, reject) => {
    try {
      // Create document with no margins initially so we can draw full-width headers
      const doc = new PDFDocument({ margin: 0, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // --- Colors ---
      const brandColor = '#005cb8';
      const darkColor = '#212529';
      const grayColor = '#6c757d';
      const lightGray = '#f8f9fa';

      // --- Header Background ---
      doc.rect(0, 0, 595, 120).fill(brandColor);

      // --- Header Text & Logo ---
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 30, { width: 120 });
      } else {
        doc.fontSize(28).fillColor('#ffffff').font('Helvetica-Bold').text('Vijay Radios', 40, 45);
        doc.fontSize(10).fillColor('#e0e0e0').font('Helvetica').text('Sound That Connects', 40, 75);
      }

      // Invoice Details in Header (Right aligned)
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(24).text('INVOICE', 350, 35, { align: 'right', width: 200 });

      doc.font('Helvetica').fontSize(10);
      doc.text(`Order ID: ${order._id}`, 250, 65, { align: 'right', width: 300 });
      doc.text(`Tracking ID: ${trackingId}`, 250, 80, { align: 'right', width: 300 });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 250, 95, { align: 'right', width: 300 });

      // --- Bill To Section ---
      doc.rect(40, 160, 250, 100).fill(lightGray);
      doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(12).text('BILL TO:', 55, 175);
      doc.font('Helvetica').fontSize(11).fillColor(grayColor);
      doc.text(order.user_name, 55, 195);
      doc.text(order.email, 55, 210);
      doc.text(order.mobile, 55, 225);
      doc.text(`${order.address}, ${order.city}, ${order.state} - ${order.zip}`, 55, 240, { width: 220 });

      // --- Table Header ---
      const tableTop = 320;
      doc.rect(40, tableTop, 515, 30).fill(brandColor);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(11);
      doc.text('DESCRIPTION', 55, tableTop + 10);
      doc.text('QTY', 350, tableTop + 10, { width: 50, align: 'center' });
      doc.text('PRICE', 420, tableTop + 10, { width: 60, align: 'right' });
      doc.text('TOTAL', 490, tableTop + 10, { width: 50, align: 'right' });

      // --- Table Body ---
      let currentY = tableTop + 40;
      doc.font('Helvetica').fontSize(10).fillColor(darkColor);

      order.items.forEach((item, index) => {
        // Alternating row colors
        if (index % 2 === 1) {
          doc.rect(40, currentY - 5, 515, 25).fill(lightGray);
          doc.fillColor(darkColor);
        }

        doc.text(item.name, 55, currentY, { width: 280 });
        doc.text(item.qty.toString(), 350, currentY, { width: 50, align: 'center' });
        doc.text(`Rs. ${item.price}`, 420, currentY, { width: 60, align: 'right' });
        doc.text(`Rs. ${item.qty * item.price}`, 490, currentY, { width: 50, align: 'right' });

        currentY += 25;
      });

      doc.moveTo(40, currentY).lineTo(555, currentY).lineWidth(1).stroke(brandColor);

      // --- Totals ---
      currentY += 20;
      doc.font('Helvetica-Bold').fontSize(11).fillColor(grayColor);
      doc.text('Subtotal:', 380, currentY, { width: 100, align: 'right' });
      doc.fillColor(darkColor).text(`Rs. ${order.subtotal}`, 490, currentY, { width: 50, align: 'right' });

      currentY += 20;
      doc.fillColor(grayColor).text('Shipping:', 380, currentY, { width: 100, align: 'right' });
      doc.fillColor(darkColor).text(`Rs. ${order.shipping}`, 490, currentY, { width: 50, align: 'right' });

      currentY += 25;
      doc.rect(370, currentY - 5, 185, 30).fill(lightGray);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(brandColor);
      doc.text('Total:', 380, currentY, { width: 90, align: 'right' });
      doc.text(`Rs. ${order.total}`, 480, currentY, { width: 60, align: 'right' });

      // --- Warranty Badge ---
      const warrantyY = doc.page.height - 120;
      doc.rect(40, warrantyY, 515, 50).fill('#e8f5e9'); // Light green background
      doc.fillColor('#2e7d32').font('Helvetica-Bold').fontSize(14);
      doc.text('★ 6 Months Comprehensive Warranty ★', 40, warrantyY + 15, { width: 515, align: 'center' });
      doc.font('Helvetica').fontSize(10).fillColor('#4caf50');
      doc.text('This invoice serves as your proof of purchase for all warranty claims.', 40, warrantyY + 32, { width: 515, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
