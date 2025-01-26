import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../loaders/logger';
import { SendOTPService } from '../services/SendOTP.service';
import { sendOTPSchema } from '../utils/validations/send-otp.validation.schema';

@Service()
export class SendOTPController {
  constructor(private readonly _sendOTPService: SendOTPService) {}

  public async sendOTP(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await sendOTPSchema.validateAsync(req.body);
      const { type, recipientId } = req.body;
      await this._sendOTPService.sendOTP(type, recipientId);

      return res.status(200).json({
        success: true,
        statusCode: 200,
      });
    } catch (error) {
      logger.error(`Error in sendOTP controller: ${error} `);
      next(error);
    }
  }
}
