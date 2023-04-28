import React, { useState } from "react";
import LayoutMain from "@/components/layouts/layoutMain";
import Jumbotron from "@/components/card/jumbotron";
import Input from "@/components/form/input";
import SubmitBtn from "@/components/form/submitBtn";
import { useMutation } from "react-query";
import { recovery } from "@/clientRequest/user";
import { useRouter } from "next/router";

export default function Recovery() {
  // state
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // hook
  const router = useRouter();
  const recoveryMutation = useMutation(recovery, {
    onSuccess: (response) => {
      if (response?.error) {
        setErrorMessage(response.error);
      } else {
        setEmail("");
        setErrorMessage("");
        console.log("success");
        router.push("/auth/recovery/waitVerify");
      }
    },
  });

  // function
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    recoveryMutation.mutate({email})
  };
  return (
    <LayoutMain page="recovery-password">
      <Jumbotron title="Recovery Page" />
      <main className="form-global-1">
        {errorMessage && <div className="error-message-global-1">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Email" value={email} type="email" setValue={setEmail} />
          <SubmitBtn />
        </form>
      </main>
    </LayoutMain>
  );
}
