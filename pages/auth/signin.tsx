import React, { useState } from "react";
import type {
  GetServerSidePropsContext,
} from "next";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import LayoutMain from "@/components/layouts/layoutMain";
import Jumbotron from "@/components/card/jumbotron";
import Input from "@/components/form/input";
import SubmitBtn from "@/components/form/submitBtn";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/router";

type props = {
  callbackUrl:  string
}

export default function SignIn({callbackUrl}: props) {
  // state
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("pinamnil@hotmail.com");
  const [password, setPassword] = useState("12345678");

  // hook
  const router = useRouter();

  // function
  const submitHandle = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (response?.error) {
      setErrorMessage(response.error);
    } else {
      router.push(callbackUrl === '/' ? '/dashboard': callbackUrl)
    }
  };

  return (
    <LayoutMain page="signin">
      <Jumbotron title="Signin Page" />
      <main className="form-global-1">
        {/* Sign In by Email */}
        <form 
        onSubmit={submitHandle}
        >
          {errorMessage && <div className="error-message-global-1">{errorMessage}</div>}

          <Input label="Email" value={email} type="text" setValue={setEmail} />
          <Input
            label="Password"
            value={password}
            type="password"
            setValue={setPassword}
          />
          <div className="mt-5">
            <SubmitBtn />
          </div>
        </form>

        {/* Sign In by Provider */}
        <div>
          <div className="flex mt-5 items-center gap-1">
            <span className="border-b border-gray-500 w-full h-1"></span>
            <span>or</span>
            <span className="border-b border-gray-500 w-full h-1"></span>
          </div>
          <button
            onClick={() => {
              signIn("google", { callbackUrl: callbackUrl === '/' ? '/dashboard': callbackUrl });
            }}
            className="mt-5 w-full border border-gray-500 py-2 rounded-md flex justify-center items-center gap-2"
          >
            <span>Signin with Google</span>
            <FcGoogle size={24} />
          </button>
        </div>

        {/* signup link */}
        <div className="text-center my-5">
          If you do not have an account please{" "}
          <Link href={"/auth/register"} className="text-blue-500">
            Register
          </Link>
        </div>
        {/* recovery link */}
        <div className="text-center my-5">
          If you forget password please{" "}
          <Link href={"/auth/recovery"} className="text-blue-500">
            Recovery
          </Link>
        </div>
      </main>
    </LayoutMain>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { callbackUrl } = context?.query;

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: callbackUrl || "/" } };
  }

  return {
    props: {
      callbackUrl: callbackUrl || "/",
    },
  };
}
