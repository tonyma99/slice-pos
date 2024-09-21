import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import type { User } from "next-auth"
import type { GitHubProfile } from "next-auth/providers/github"
import type { GoogleProfile } from "next-auth/providers/google"
 
export interface UserModel extends User {
    createdAt?: Date
    updatedAt?: Date
    lastLogin?: Date
}

const newUser = (profile: GitHubProfile | GoogleProfile ) => {
    const now = new Date()

    return {
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
        createdAt: now,
        updatedAt: now,
        lastLogin: now,
    }
}

export default {
    providers: [
        GitHub({
            allowDangerousEmailAccountLinking: true,
            profile(profile): UserModel {
                return newUser(profile)
            }
        }),
        Google({
            allowDangerousEmailAccountLinking: true,
            profile(profile): UserModel {
                return newUser(profile)
            }
        })
    ],
} satisfies NextAuthConfig
