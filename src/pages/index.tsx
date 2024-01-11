import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Optimism from "./optimism/index";
import "./index.module.scss";

const IndexPage: React.FC<PageProps> = () => {
  return <Optimism />;
};

export default IndexPage;

export const Head: HeadFC = () => {
  return (
    <>
      <title>Home Page</title>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Coiny&display=swap');
      </style>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Coiny&family=Sono&display=swap');
      </style>
    </>
  );
};
