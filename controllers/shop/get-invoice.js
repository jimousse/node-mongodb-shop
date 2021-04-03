const fs = require('fs');
const path = require('path');
const User = require('../../models/user');
const PDFKit = require('pdfkit');

module.exports = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await User.findOrderById(orderId);
    if (!order) return next(new Error('No order found.'));
    // restrict access to the correct user
    if (order.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized.'));
    }

    const invoice = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoice);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${invoice}`);

    const pdfDoc = new PDFKit();
    // writes on the serser
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    // writes into the response
    pdfDoc.pipe(res);
    pdfDoc.fontSize(20).text('Invoice');
    pdfDoc.fontSize(15).text('-------------------');
    order.items.forEach(item => {
      pdfDoc.text(`- ${item.title}, x${item.quantity}, $${item.productTotalPrice}`);
    });
    pdfDoc.text('-------------------');
    pdfDoc.text(`Total: $${order.totalPrice}`)
    pdfDoc.end();

    console.log('Sending invoice file', invoicePath);
  } catch (err) {
    next(err);
  }
}
