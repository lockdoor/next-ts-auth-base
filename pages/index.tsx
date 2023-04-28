import React from "react";
import Jumbotron from "@/components/card/jumbotron";
import LayoutMain from "@/components/layouts/layoutMain";

export default function Home() {
  return (
    <LayoutMain page="home">
      <Jumbotron title="Home Page" subTitle="This Page is in construction" />
    </LayoutMain>
  );
}
