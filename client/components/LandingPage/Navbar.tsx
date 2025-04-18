"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/leetcode-logo.png";
import LoginModal from "./LoginModal";
import SignOut from "./SignOut";
const Navbar = () => {
  const { data } = useSession();
  return (
    <div className=" flex bg-slate-800 text-slate-100 justify-between  items-center px-16 py-5">
      <div className="flex gap-3">
        <div>
          <Image src={logo} alt="image" />
        </div>
        <Link href={"/"} className=" text-xl font-semibold">
          Leetcode
        </Link>
      </div>
      <div className=" text-lg font-medium flex gap-7 ">
        <Link className=" hover:underline" href={"/addproblem"}>
          Add Problem
        </Link>
        <Link className=" hover:underline" href={"/problem"}>
          Solve Problem
        </Link>
      </div>
      <div>
        {data && data.user ? (
          <SignOut/>
        ) : (
          <LoginModal />
        )}
      </div>
    </div>
  );
};

export default Navbar;
