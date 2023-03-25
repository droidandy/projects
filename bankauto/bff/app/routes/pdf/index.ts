import { Router } from 'express';
import { generateInstalmentPdf, generateSimplePdf } from '../../services/pdfGenerator';
import { getQrCode } from '../../services/qrCode';
import { getBase64Img } from '../../services/pdfGenerator/getBase64Img';
import { getInstalmentData } from '../../services/instalmentPdfData';
import { getAuthHeaders } from '../../utils/authHelpers';
import { getSimpleData } from '../../services/simplePdfData';

const router = Router();

router.get('/get-instalment-data/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getInstalmentData(id, auth);

    res.json({ ...data, salesOfficePhones: data.salesOfficePhones[0] });
  } catch (e) {
    next(e);
  }
});

router.get('/get-simple-data/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getSimpleData(id, auth);

    res.json({ ...data, salesOfficePhones: data.salesOfficePhones[0] });
  } catch (e) {
    next(e);
  }
});

router.get('/instalment/generate', async (req, res, next) => {
  try {
    const { query } = req;

    const car = await getBase64Img(query.vehicleImage as string);

    const encoded = Buffer.from(query.qrCodeUrl as string).toString('base64');
    const { data: qrCodeImg } = await getQrCode(encoded);

    const qrCode = await getBase64Img(qrCodeImg);

    query.vehicleImage = car;
    query.qrCode = qrCode;

    // @ts-ignore
    const url = generateInstalmentPdf(query);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Bankauto-installment.pdf');
    res.setHeader('Content-Length', url.byteLength);
    res.send(Buffer.from(url));
  } catch (e) {
    next(e);
  }
});

router.get('/get-qr-code', async (req, res, next) => {
  try {
    const { url } = req.query;
    const encoded = Buffer.from(url as string).toString('base64');

    const { data } = await getQrCode(encoded);

    res.send(data);
  } catch (e) {
    next(e);
  }
});

router.get('/simple/generate', async (req, res, next) => {
  try {
    const { query } = req;

    const encoded = Buffer.from(query.qrCodeUrl as string).toString('base64');
    const { data: qrCodeImg } = await getQrCode(encoded);

    const qrCode = await getBase64Img(qrCodeImg);
    query.qrCode = qrCode;

    // @ts-ignore
    const url = generateSimplePdf(query);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Bankauto-installment.pdf');
    res.setHeader('Content-Length', url.byteLength);
    res.send(Buffer.from(url));
  } catch (e) {
    next(e);
  }
});

export default router;
