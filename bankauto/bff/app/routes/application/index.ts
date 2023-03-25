import { Router } from 'express';
import { VehicleShort } from '@marketplace/ui-kit/types';
import { getAuthHeaders } from '../../utils/authHelpers';
import {
  getApplication,
  getApplications,
  addApplication,
  createApplicationCredit,
  updateApplicationCredit,
  updateApplicationCreditBasic,
  updateApplicationCreditAdditional,
  updateApplicationCreditJob,
  updateApplicationInsurance,
  updateApplicationCreditSteps,
  calculateApplicationInsurance,
  importApplicationInsurance,
  updateApplicationTradeIn,
  updateApplicationTradeInStatus,
  updateApplicationInsuranceStatus,
  updateApplicationCreditStatus,
  updateApplicationVehicleStatus,
  createApplicationTradeIn,
  createApplicationInsurance,
  createApplicationSimpleCredit,
  createApplicationBookingOrder,
  getApplicationWithBookingStatus,
  getApplicationInsurancePaymentLinks,
  scheduleMeeting,
  updateMeeting,
  updateApplicationSimpleCreditAdditional,
  updateApplicationSimpleCreditJob,
  createApplicationInstalment,
  updateInstalmentStatus,
  updateApplicationInstalment,
  createApplicationDeposit,
  updateApplicationSimpleCreditBasic,
  updateApplicationSimpleCreditSteps,
  createC2cApplication,
  bindUser,
  updateApplicationSimpleCreditStatus,
  createApplicationDebit,
  scheduleVehicleMeeting,
  createApplicationCreditFis,
  updateApplicationCreditFis,
  updateApplicationCreditFisBasic,
  updateApplicationCreditFisDocuments,
  updateApplicationCreditFisAdditional,
  updateApplicationCreditFisJob,
  updateApplicationCreditFisSteps,
  updateApplicationCreditFisCalculation,
  updateApplicationCreditFisIncome,
  getApprovedCreditExists,
  createSavingsAccount,
  getInsuranceRedirectUrl,
  scheduleVehicleInstallmentMeeting,
  getSravniUrl,
  payForOrder,
  syncOrderPayment,
  bookWithoutPayment,
  cancelHolding,
  bookWithPayment,
  getLastActiveCredit,
} from '../../services/application';
import { getVehicle } from '../../services/vehicle';
import { getClientAllVehicles } from '../../services/clientVehicle';

const router = Router();

router.get('/credit-fis/get-sravni-url/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await getSravniUrl(id, req.query, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data: applicationsData } = await getApplications(req.query, auth);

    const applicationsIds = applicationsData
      .map((app) => app.vehicle?.vehicleId || app.instalment?.vehicleId || app.c2c?.vehicleId)
      .filter((id) => !!id) as number[];
    const { data: vehicleData } = await getClientAllVehicles(applicationsIds, auth);
    const vehiclesMap: Record<number, VehicleShort> = vehicleData.reduce((acc, vehicle) => {
      if (!acc[vehicle.id]) {
        acc[vehicle.id] = vehicle;
      }

      return acc;
    }, {} as Record<number, VehicleShort>);

    const applications = applicationsData
      .map((application) => {
        let vehicleId;

        if (application.vehicle) {
          vehicleId = application.vehicle.vehicleId;
        } else if (application.instalment) {
          vehicleId = application.instalment.vehicleId;
        } else if (application.c2c) {
          vehicleId = application.c2c.vehicleId;
        }

        return {
          ...application,
          vehicle: application.vehicle ?? null,
          vehicleData: vehicleId ? vehiclesMap[vehicleId] : null,
        };
      })
      .filter((application) => !!application.vehicleData || !!application.simpleCredit);
    res.json(applications);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const data = await getApplication(id, auth);
    const { data: applicationData } = data;
    const vehicleId =
      applicationData.vehicle?.vehicleId || applicationData.instalment?.vehicleId || applicationData.c2c?.vehicleId;

    if (vehicleId) {
      const { data: vehicleData } = await getVehicle(vehicleId);
      res.json({ ...applicationData, vehicleData });
    }

    res.json(applicationData);
  } catch (e) {
    next(e);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await addApplication(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/credit', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createApplicationCredit(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCredit(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit/:id/basic/:uuid*?', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditBasic(id, params, auth, uuid);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit/:id/additional/:uuid*?', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditAdditional(id, params, auth, uuid);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit/:id/job/:uuid*?', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditJob(id, params, auth, uuid);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const { status } = req.body;

    const { data } = await updateApplicationCreditStatus(id, status, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit/:id/steps/:uuid*?', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditSteps(id, params, auth, uuid);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/credit-fis', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createApplicationCreditFis(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditFis(id, params, auth, uuid);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id/basic', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const { data } = await updateApplicationCreditFisBasic(id, { ...params, client_ip: clientIp }, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id/calculation', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditFisCalculation(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id/documents', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditFisDocuments(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id/additional', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditFisAdditional(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id/job', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditFisJob(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id/income', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditFisIncome(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/credit-fis/:id/steps', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationCreditFisSteps(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/credit-fis/get-last-active', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getLastActiveCredit(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/simple-credit', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createApplicationSimpleCredit(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/simple-credit/:id/:uuid/steps', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationSimpleCreditSteps(id, uuid, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/simple-credit/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const { status } = req.body;

    const { data } = await updateApplicationSimpleCreditStatus(id, status, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/simple-credit/basic/:id/:uuid', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationSimpleCreditBasic(id, uuid, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/simple-credit/additional/:id/:uuid', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationSimpleCreditAdditional(id, uuid, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/simple-credit/job/:id/:uuid', async (req, res, next) => {
  try {
    const { id, uuid } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationSimpleCreditJob(id, uuid, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/bind-user', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    await bindUser(auth);
    res.send('ok');
  } catch (e) {
    next(e);
  }
});

router.get('/insurance-payment-links/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { successUrl, failUrl } = req.query as { successUrl: string; failUrl: string };
    const auth = getAuthHeaders(req);

    const { data } = await getApplicationInsurancePaymentLinks(id, successUrl, failUrl, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/insurance', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createApplicationInsurance(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/insurance/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationInsurance(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/insurance/:id/calculate', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await calculateApplicationInsurance(id, params, auth);

    res.json({ ...data, id });
  } catch (e) {
    next(e);
  }
});

router.put('/insurance/:id/import', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);

    const { data } = await importApplicationInsurance(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/insurance/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const { status } = req.body;

    const { data } = await updateApplicationInsuranceStatus(id, status, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/insurance-redirect-url', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getInsuranceRedirectUrl(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/trade-in', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createApplicationTradeIn(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/trade-in/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationTradeIn(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/vehicle/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationVehicleStatus(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/trade-in/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const { status } = req.body;

    const { data } = await updateApplicationTradeInStatus(id, status, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/booking/order/:applicationId', async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createApplicationBookingOrder(applicationId, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/booking/status/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const auth = getAuthHeaders(req);

    const { data: applicationData } = await getApplicationWithBookingStatus(orderId, auth);
    if (applicationData.vehicle?.vehicleId) {
      const { data: vehicleData } = await getVehicle(applicationData.vehicle.vehicleId);
      res.json({ ...applicationData, vehicleData });
    } else {
      res.json(applicationData);
    }
  } catch (e) {
    next(e);
  }
});

router.post('/item/:id/meeting/schedule', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const params = req.body;

    const { data } = await scheduleMeeting(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/item/:id/meeting/schedule', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const params = req.body;

    const { data } = await updateMeeting(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/instalment', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createApplicationInstalment(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/instalment/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await updateApplicationInstalment(id, params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/instalment/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const auth = getAuthHeaders(req);
    const { status } = req.body;
    const { data } = await updateInstalmentStatus(id, status, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/deposit', async (req, res, next) => {
  try {
    const params = req.body;
    const { data } = await createApplicationDeposit(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/savings-account', async (req, res, next) => {
  try {
    const params = req.body;
    const { data } = await createSavingsAccount(params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/vehicle-c2c', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;

    const { data } = await createC2cApplication(auth, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/card-debit', async (req, res, next) => {
  try {
    const params = req.body;
    const { data } = await createApplicationDebit({ ...params, card_name: params.debitCardData.debitCardName });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/vehicle/:id/meeting/schedule', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const params = req.body;

    const { data } = await scheduleVehicleMeeting(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/vehicle/instalment/:id/meeting/schedule', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const params = req.body;

    const { data } = await scheduleVehicleInstallmentMeeting(auth, id, params);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/check-approved-credit', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { data } = await getApprovedCreditExists(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/booking/vehicle/:applicationId', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { applicationId } = req.params;

    const { data } = await payForOrder(auth, applicationId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/booking/status-by-vehicle/:vehicleId', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { vehicleId } = req.params;

    const { data } = await syncOrderPayment(auth, vehicleId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/vehicle/:vehicleId/book-with-payment', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { vehicleId } = req.params;

    const { data } = await bookWithPayment(auth, vehicleId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/vehicle/:vehicleId/book-without-payment', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { vehicleId } = req.params;

    const { data } = await bookWithoutPayment(auth, vehicleId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/booking/hold-cancel/:vehicleId', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);

    const { vehicleId } = req.params;

    const { data } = await cancelHolding(auth, vehicleId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
