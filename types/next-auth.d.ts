
import { IUser } from "./user";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser;
    token?: {
      address: string;
      provider?: string;
      accessToken?: string;
      expires?: string;
    };
  }

  interface User {
    address: string;
    provider: string;
    accessToken?: string;
    expires?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    address: string;
    provider?: string;
    accessToken?: string;
    expires?: string;
  }
}
