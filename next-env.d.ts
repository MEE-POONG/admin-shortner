/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: any;
      name: any;
      email: any;
      emailVerified: any;
      password: any;
      image: any;
      [key?: any]: any;
    };
    [key: any]: any;
  }
  interface User {
    [key: any]: any;
  }
  interface Token {
    [key: any]: any;
  }
}
