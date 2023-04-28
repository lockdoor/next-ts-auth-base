import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { verifyRecovery, changeUserPassword } from "@/clientRequest/user";
import LayoutMain from "@/components/layouts/layoutMain";
import Jumbotron from "@/components/card/jumbotron";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Input from '@/components/form/input'
import SubmitBtn from '@/components/form/submitBtn'
import { signIn } from "next-auth/react";


type props = {
  token: string;
};

export default function ComfirmRecovery({ token }: props) {

  // hook
  const router = useRouter();
  const { isLoading, isError, data, error } = useQuery(
    ["verifyRegister", token],
    () => verifyRecovery(token),
    {
      onSuccess: (response) => {
        if (response?.error) {
          setErrorMessage(response.error);
        } else {
          setErrorMessage("");
          setEmail(response.email)
        }
      },
    }
  );
  const changePasswordMutation = useMutation(changeUserPassword, {
    onSuccess: async (response) => {
      if(response?.error){
        setErrorMessage(response.error)
      }else{
        await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
          });
        router.push('/dashboard')
      }
    }
  })

  // state
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // function
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    changePasswordMutation.mutate({email, password})
  }

  if (isError) {
    console.log(error)
    return <div>error by query</div>;
  }

  return (
    <LayoutMain page="confirm registation" loading={isLoading}>
      <Jumbotron title="Confirm Recovery" />
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
        <main className="form-global-1">
        {errorMessage && <div className="error-message-global-1">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Password" value={password} type="password" setValue={setPassword} />
          <SubmitBtn />
        </form>
      </main>
      )}
    </LayoutMain>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { token: context.params?.token },
  };
};
