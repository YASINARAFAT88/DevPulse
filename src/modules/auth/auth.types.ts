export interface SignupBody {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}

export interface LoginBody {
  email: string;
  password: string;
}