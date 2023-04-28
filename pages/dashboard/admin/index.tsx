import React from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import { getToken } from "next-auth/jwt";

export default function DashboardAdmin({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = JSON.parse(token);
  return (
    <>
      <div>Admin Page</div>
      <div>
        {user?.picture && (
          <Image
            width={200}
            height={200}
            alt={user.name || "picture"}
            src={user.picture as string}
            priority={true}
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = await getToken(context);
  if (token?.role === "admin") {
    return {
      props: { token: JSON.stringify(token) },
    };
  } else {
    return { redirect: { destination: "/403" } };
  }
}
