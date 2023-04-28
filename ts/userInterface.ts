export interface Register {
  name: string;
  email: string;
  password: string;
}

export interface EmailToken {
  email: string;
  password: string;
  name: string;
}
