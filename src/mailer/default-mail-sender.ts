import { injectable } from 'smart-factory';
import { MailerModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MailerTypes } from './types';
import { Transporter, createTransport } from 'nodemailer';

injectable(MailerModules.SendActivationMail,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<MailerTypes.SendActivationMail> =>

    async (email) => {
      console.log(transporter());
    });

let tx: Transporter = null;
const transporter = (): Transporter => {
  if (tx == null) {
    tx = createTransport({
      host: 'smtp.gmail.com'
    });
  }
  return tx;
};