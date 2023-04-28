import React from "react";
import NavMain from "../nav/navMain";
import Head from "next/head";
import Loading from "./loading";

interface Props {
  children: React.ReactNode;
  page: string;
  title?: string;
  loading?: boolean;
}

export default function LayoutMain({
  children,
  page,
  title = "Next Auth",
  loading = false,
}: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        {loading && (
          <div className=" fixed bg-slate-400 opacity-70 z-50 h-screen w-screen">
            <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <Loading color="#e11d48" />
            </div>
          </div>
        )}
        <NavMain page={page} />
        <div>{children}</div>
      </main>
    </>
  );
}
