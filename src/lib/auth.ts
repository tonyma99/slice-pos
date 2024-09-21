import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import authConfig from "@/lib/auth.config"
import client from "@/lib/mongodb"
import type { Provider } from "next-auth/providers"

export const providerMap = authConfig.providers
    .map((provider: Provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials")
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(client, { databaseName: process.env.NODE_ENV === "development" ? 'test' : 'production' }),
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },  
        jwt: ({ token, user }) => {
            if (user) {
                token.id = user.id
            }
            return token
        },
        session: ({ session, token }) => {
            session.user.id = token.id as string
            return session
        },
        signIn: async (profile) => {
            return true;
        },
    },
    pages: {
        signIn: "/signin",
    },
    session: { strategy: "jwt" },
    ...authConfig
})
