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

    async (param) => {
      const txer = transporter(mailerCfg);
      const content = `Thank you for join the Chatpot.<br /><br />
You can finish the email registration process via below link.<br />
also typing the code manually is available option.<br /><br />
Activation code : <b>${param.code}</b><br/><br />
<a href="http://dev-auth.chatpot.chat/member/activate?code=${param.code}">Finish the email registration</a><br /><br />
Enjoy!<br /><br />
Sincerly,<br />
Chatpot Team.<br />
      `;

      await txer.sendMail({
        from: '"Chatpot-Dev 👻" <jindongp@gmail.com>',
        to: param.email,
        subject: '[Chatpot] Account activation',
        html: content
      }); // TODO: html content add required
    });

let tx: Transporter = null;
const transporter = (cfg: ConfigTypes.MailerConfig): Transporter => {
  if (tx == null) {
    tx = createTransport(cfg);
  }
  return tx;
};