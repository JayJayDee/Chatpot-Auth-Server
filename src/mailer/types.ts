export namespace MailerTypes {
  type ActivationParam = {
    email: string;
    code: string;
  };
  export type SendActivationMail = (param: ActivationParam) => Promise<void>;
}