export namespace MailerTypes {
  export type SendActivationMail = (email: string) => Promise<void>;
}