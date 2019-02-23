export type AvatarCreateParam = {
  gender: string;
  nickEn: string;
};

export type AvatarImage = {
  orig: string;
  thumbnail: string;
};

export type CreateAvatar = (param: AvatarCreateParam) => Promise<AvatarImage>;