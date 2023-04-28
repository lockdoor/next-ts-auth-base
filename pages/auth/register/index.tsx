import React, { useState } from "react";
import Input from "@/components/form/input";
import SubmitBtn from "@/components/form/submitBtn";
import Jumbotron from "@/components/card/jumbotron";
import LayoutMain from "@/components/layouts/layoutMain";
import { useMutation } from "react-query";
import { register } from "@/clientRequest/user";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import type {
  GetServerSidePropsContext,
} from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // hook
  const router = useRouter()
  const registerMutation = useMutation(register, {
    onSuccess: (response) => {
      if (response?.error) {
        setErrorMessage(response.error);
      } else {
        setName("");
        setEmail("");
        setPassword("");
        setErrorMessage("");
        console.log("success");
        router.push('/auth/register/waitVerify')
      }
    },
  });

  // function
  const submitHandle = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <LayoutMain page="register">
      <Jumbotron title="Register Page" subTitle="Welcome to my shop" />

      <main className="form-global-1">
        {/* Register by Email */}
        <form onSubmit={submitHandle}>
          {errorMessage && <div className="error-message-global-1">{errorMessage}</div>}
          <Input label="Name" value={name} type="text" setValue={setName} />
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

        {/* Register by Provider */}
        <div>
          <div className="flex mt-5 items-center gap-1">
            <span className="border-b border-gray-500 w-full h-1"></span>
            <span>or</span>
            <span className="border-b border-gray-500 w-full h-1"></span>
          </div>
          <button
            onClick={() => {
              signIn("google", { callbackUrl: "/dashboard" });
            }}
            className="mt-5 w-full border border-gray-500 py-2 rounded-md flex justify-center items-center gap-2"
          >
            <span>Register with Google</span>
            <FcGoogle size={24} />
          </button>
        </div>

        {/* signin link */}
        <div className="text-center my-5">
          If you have an account please
          <Link href={"/auth/signin"} className="text-blue-500">
            {" "}
            Signin
          </Link>
        </div>
      </main>
    </LayoutMain>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { callbackUrl } = context?.query;
  if (session) {
    return { redirect: { destination: callbackUrl || "/" }};
  }
  return {
    props: {},
  };
}
