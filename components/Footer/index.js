import React from "react";
import Socials from "../Socials";
import Link from "next/link";
import Button from "../Button";

const Footer = ({}) => {
  return (
    <>
      <div className="mt-5 lg:mt-40 p-2 lg:p-0">
        <div>
          <h1 className="text-2xl text-bold">Contact.</h1>
          <div className="mt-10">
            <h1 className="text-3xl md:text-6xl lg:text-6xl 2xl:text-8xl text-bold">
              LET&apos;S WORK
            </h1>
            <h1 className="text-3xl md:text-6xl lg:text-6xl 2xl:text-8xl text-bold">
              TOGETHER
            </h1>
            <Button type="primary">Schedule a call</Button>
            <div className="mt-10">
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-sm text-bold mt-2 lg:mt-10 p-2 lg:p-0">
        Made With ❤ by{" "}
        <Link href="#">
          <span className="underline underline-offset-1">Thierno Sadou Barry</span>
        </Link>
      </h1>
    </>
  );
};

export default Footer;
