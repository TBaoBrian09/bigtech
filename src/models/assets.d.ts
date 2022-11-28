export interface Assets {
  title: string;
  subTitle: string;
  icon: string;
  token: string;
  isActive?: boolean;
  id?: number;
}

export interface Token {
  title: string;
  subTitle?: string;
  icon: string;
  token: string;
  address: string;
  type?: string;
}
