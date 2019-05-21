import { injectable } from 'smart-factory';
import { MailerModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { MailerTypes } from './types';

injectable(MailerModules.SendActivationMail,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<MailerTypes.SendActivationMail> =>

    async (email) => {

    });