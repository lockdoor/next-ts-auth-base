import React from "react";
import LayoutMain from "@/components/layouts/layoutMain";
import Jumbotron from "@/components/card/jumbotron";

export default function Forbidden() {
  return (
    <LayoutMain page="403">
      <Jumbotron
        title="Error 403 - Forbidden"
        subTitle="You don't have permission to access on this page"
      />
    </LayoutMain>
  );
}
