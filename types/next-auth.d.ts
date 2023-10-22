import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    session: {
        user: {
          [key: string]: any
        }
      [key: string]: any
    }
    user: {
      [key: string]: any
    }
  }
}