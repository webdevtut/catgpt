import Head from "next/head";
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client'
import { getSession } from '@auth0/nextjs-auth0'
import { faCat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  const {isLoading, error, user} = useUser();

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <>
      <Head>
        <title>CatGPT | Login | Signup</title>
      </Head>
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-800 text-center text-white">
        <div>
          {!!user && <Link href="/api/auth/logout">Logout</Link>}
          {!user && (
            <>
              <div className="my-3 text-5xl">
                <FontAwesomeIcon icon={faCat} className="text-emerald-200" />
              </div>
              <div className="my-3 text-3xl">
                <h1>Welcome to CatGPT</h1>
              </div>
              <div className="my-3 text-xl">
                <h1>
                  By{" "}
                  <a
                    href="https://www.linkedin.com/in/tushar-web-dev/"
                    className="text-emerald-200 underline"
                  >
                    Tushar Kadam
                  </a>
                </h1>
              </div>
              <Link href="/api/auth/login" className="btn">
                Login
              </Link>
              <Link href="/api/auth/signup" className="btn ml-2">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res);
  if (!!session) {
    return {
      redirect: {
        destination: "/chat",
      },
    };
  }
  return {
    props: {},
  };
};
