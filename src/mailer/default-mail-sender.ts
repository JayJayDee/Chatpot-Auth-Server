import { injectable } from 'smart-factory';
import { MailerModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MailerTypes } from './types';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigModules, ConfigTypes } from '../config';

injectable(MailerModules.SendActivationMail,
  [ LoggerModules.Logger,
    ConfigModules.MailerConfig ],
  async (log: LoggerTypes.Logger,
    mailerCfg: ConfigTypes.MailerConfig): Promise<MailerTypes.SendActivationMail> =>

    async (email) => {
      const txer = transporter(mailerCfg);
      await txer.sendMail({
        from: '"Chatpot-Dev 👻" <jindongp@gmail.com>',
        to: email,
        subject: '[Chatpot] Account activation'
      }); // TODO: html content add required
    });

let tx: Transporter = null;
const transporter = (cfg: ConfigTypes.MailerConfig): Transporter => {
  if (tx == null) {
    tx = createTransport(cfg);
  }
  return tx;
};