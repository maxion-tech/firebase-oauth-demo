import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { Providers } from '@/enums/web3'

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'MetaMask',
      id: 'metamask',
      credentials: {
        address: {
          label: 'Address',
          type: 'text',
          placeholder: '0x0',
        },
        accessToken: {
          label: 'AccessToken',
          type: 'text',
          placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        },
        expires: { label: 'Expires', type: 'text' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) {
            throw new Error('No credentials provided')
          }

          const { address, accessToken, expires } = credentials

          return {
            id: address,
            provider: Providers.METAMASK,
            address,
            accessToken: accessToken,
            expires,
          }
        } catch (error) {
          console.error('Error authorizing:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const { accessToken, address, provider, expires } = user

        token.address = address
        token.provider = provider
        token.accessToken = accessToken
        token.expires = expires
      }
      return token
    },
    async session({ session, token }) {
      session.user.address = token.address
      session.user.provider = token.provider
      session.user.accessToken = token.accessToken
      session.user.expires = token.expires

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
  debug: process.env.NEXT_PUBLIC_APP_ENV !== 'production',
})

export { handler as GET, handler as POST };