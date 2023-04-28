import React from "react";
import type { GetServerSidePropsContext } from "next";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

export default function Dashboard() {
  return <></>;
}

// import { roleCheck } from "@/controller/user";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const session = await getServerSession(context.req, context.res, authOptions);
  const token = await getToken(context)
  console.log('token is => ', token) 
  // const role = await roleCheck(session?.user?.email as string)  
  return {
    redirect: { destination: `/dashboard/${token?.role}` },
    // props: {}
  };
}
