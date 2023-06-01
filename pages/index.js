import Head from "next/head";
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
  const {isLoading, error, user} = useUser();

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div>
      <Head>
        <title>CatGPT</title>
      </Head>
      <h1>Welcome to the Next JS &amp; CatGPT</h1>
      <div>
        {!!user && <Link href="/api/auth/logout">Logout</Link>}
        {!user && <Link href="/api/auth/login">Login</Link>}
      </div>
    </div>
  );
}
