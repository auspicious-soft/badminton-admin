import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" }, // Change username to email
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        console.log('credentials: ', credentials);
        if (credentials.email) { // Check for email instead of username
          return {
            email: credentials.email,
            fullName: credentials.fullName,
            id: credentials._id,
            role: credentials.role,
            profilePic: credentials.profilePic,
            venueId : credentials.venueId,
            venueName : credentials.venueName, 
            venueLong: credentials?.long,
            venueLat: credentials?.lat
          };
        } else {
          throw new CredentialsSignin("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = (user as any).fullName;
        token.picture = (user as any).profilePic;
        token.role = (user as any).role;
        token.venueId = (user as any).venueId;
        token.venueName = (user as any).venueName;
        token.venueLong = (user as any).venueLong;
        token.venueLat = (user as any).venueLat;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).user.fullName = token.fullName;
        (session as any).user.email = token.email;
        session.user.image = token.picture;
        (session as any).user.role = token.role;
        (session as any).user.venueId = token.venueId;
        (session as any).user.venueName = token.venueName;
        (session as any).user.venueLong = token.venueLong;
        (session as any).user.venueLat = token.venueLat;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});