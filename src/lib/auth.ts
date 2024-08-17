import prisma from "@/app/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const NEXT_AUTH: any = {
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials: any) {
                const { email, password } = credentials;    

                const userExists = await prisma.user.findUnique({
                    where: {
                        email
                    }
                });

                if (!userExists) {
                    throw new Error("No user found with this email address");
                }
                const isValid = await bcrypt.compare(password, userExists.password);

                if (userExists && !isValid) {

                    throw new Error("Incorrect password, please try again");

                }

                return {
                    id: userExists.id.toString(),
                    name: userExists.name,
                    email: userExists.email,
                    profileImageUrl: userExists.profileImageUrl,  // Include the user's image
                };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
            if (user) {
                token.sub = user.id;
                token.name = user.name;
                token.email = user.email;
                token.profileImageUrl = user.profileImageUrl;  // Include the user's image in the token
            }
            return token;
        },
        session: async ({ session, token }: any) => {
            session.user = {
                sub: token.sub,
                email: token.email,
                name: token.name,
                profileImageUrl: token.profileImageUrl,  // Include the user's image in the session
            };
            return session;
        }
    },
    pages: {
        signIn: "/signin"
    }
};
