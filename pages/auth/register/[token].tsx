import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { verifyRegister } from "@/clientRequest/user";
import LayoutMain from "@/components/layouts/layoutMain";
import Jumbotron from "@/components/card/jumbotron";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";

type props = {
  token: string;
};

export default function ComfirmRegister({ token }: props) {
  let myInterval: any = null;
  // hook
  const router = useRouter();
  const { isLoading, isError, data, error } = useQuery(
    ["verifyRegister", token],
    () => verifyRegister(token),
    {
      onSuccess: (response) => {
        if (response?.error) {
          setErrorMessage(response.error);
        } else {
          setErrorMessage("");
          myInterval = setInterval(() => {
            setSec((prev) => prev - 1);
          }, 1000);
          signIn("credentials", {
            email: response.email,
            password: response.password,
            redirect: false,
          });
        }
      },
    }
  );

  // state
  const [errorMessage, setErrorMessage] = useState("");
  const [sec, setSec] = useState(10);

  const goToDashboard = () => {
    if (sec <= 0) {
      router.push("/dashboard");
      clearInterval(myInterval);
      return
    }
  };

  useEffect(goToDashboard, [sec]);

  if (isError) {
    console.log(error)
    return <div>error by query</div>;
  }

  return (
    <LayoutMain page="confirm registation" loading={isLoading}>
      <Jumbotron title="Confirm Registation" />
      {!data ? (
        <></>
      ) : errorMessage ? (
        <div className="text-center my-5">
          <div className="error-message-global-1 my-5">{errorMessage}</div>
          <Link
            className="text-4xl my-5 text-blue-500 hover:text-blue-700"
            href={"/auth/register"}
          >
            Register
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-2xl my-5 text-center">
            Your Registation is success
          </p>
          <p className="text-2xl my-5 text-center">
            We will bring you to Dashboard page in {sec} second
          </p>
          <p className="text-2xl my-5 text-center">
            If Dashboard page not open please click link below to Dashboard
          </p>
          <p className="text-4xl my-5 text-center">
            <Link
              className="text-blue-500 hover:text-blue-700"
              href={"/Dashboard"}
            >
              Dashboard
            </Link>
          </p>
        </div>
      )}
    </LayoutMain>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { token: context.params?.token },
  };
};
