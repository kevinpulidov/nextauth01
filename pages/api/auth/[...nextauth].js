import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import Auth0Provider from "next-auth/providers/auth0"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from '../../../lib/mongodb';
import connectDB from '../../../lib/connectDB';
import Users from '../../models/userModel';
import bcrypt from 'bcrypt';
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
connectDB();



export default NextAuth({



//adapter: MongoDBAdapter(clientPromise),
    
  // Configure one or more authentication providers
  providers: [
 
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const email = credentials.email;
        const password = credentials.password;
        const user = await Users.findOne({ email })
        if (!user) {
          throw new Error("Aún no te has registrado")
        }
        if (user) {
          return signInUser({ password, user})
        }
      }
    }),


    // ...add more providers here

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
   }),
  
  ],
  pages: {
    signIn: "/signin"
  },
  secret: "secret",
  database: process.env.MONGODB_URI,
})

const signInUser = async({ password, user }) => {
  if(!user.password) {
    throw new Error("Por favor, ingrese contraseña")
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Contraseña no correcta")
  }
  return user
}