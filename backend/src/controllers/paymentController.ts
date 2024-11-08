import { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import md5 from 'md5';
import Balance from '../models/balanceModel'; 
import authMiddleware from '../auth/authMiddleware'; 

dotenv.config();

const payuApiLogin = process.env.PAYU_API_LOGIN;
const payuApiKey = process.env.PAYU_API_KEY;
const payuMerchantId = process.env.PAYU_MERCHANT_ID;
const payuAccountId = process.env.PAYU_ACCOUNT_ID;
const payuApiUrl = process.env.PAYU_API_URL;

if (!payuApiLogin || !payuApiKey || !payuMerchantId || !payuAccountId || !payuApiUrl) {
  throw new Error("PayU credentials are not defined in the environment variables");
}

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const referenceCode = `payment_${new Date().getTime()}`;
  const signature = md5(`${payuApiKey}~${payuMerchantId}~${referenceCode}~${amount}~USD`);

  try {
    const response = await axios.post(payuApiUrl, {
      language: "en",
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiLogin: payuApiLogin,
        apiKey: payuApiKey
      },
      transaction: {
        order: {
          accountId: payuAccountId,
          referenceCode: referenceCode,
          description: "Payment test",
          language: "en",
          signature: signature,
          additionalValues: {
            TX_VALUE: {
              value: amount,
              currency: "USD"
            }
          },
          buyer: {
            merchantBuyerId: userId,
            fullName: "Test User",
            emailAddress: "test@example.com",
            contactPhone: "7563126",
            dniNumber: "5415668464654",
            shippingAddress: {
              street1: "Calle 93B",
              street2: "17 25",
              city: "Bogotá",
              state: "Bogotá D.C.",
              country: "CO",
              postalCode: "000000",
              phone: "7563126"
            }
          },
          shippingAddress: {
            street1: "Calle 93B",
            street2: "17 25",
            city: "Bogotá",
            state: "Bogotá D.C.",
            country: "CO",
            postalCode: "000000",
            phone: "7563126"
          }
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: "VISA",
        paymentCountry: "CO",
        deviceSessionId: "vghs6tvkcle931686k1900o6e1",
        ipAddress: "127.0.0.1",
        cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
        userAgent: "Mozilla/5.0"
      },
      test: true
    });

    const paymentResponse = response.data;

    if (paymentResponse.code === 'SUCCESS') {
      const balance = await Balance.findOneAndUpdate(
        { userId },
        { $inc: { amount: amount } },
        { new: true, upsert: true }
      );

      res.send({
        message: 'Payment successful',
        balance: balance.amount,
        payUResponse: paymentResponse
      });
    } else {
      res.status(400).send({
        message: 'Payment failed',
        payUResponse: paymentResponse
      });
    }
  } catch (error: any) {
    res.status(500).send({
      error: error.message,
    });
  }
};
