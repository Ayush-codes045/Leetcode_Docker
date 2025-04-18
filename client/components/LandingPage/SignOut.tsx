"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const SignOut = () => {
  const { data } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data?.user?.image || ""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{data?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
    <Button
        className=" bg-slate-100 text-slate-600 hover:text-slate-100 font-bold text-md"
        size={"lg"}
        onClick={() => signOut()}
      >
        LogOut
      </Button>
      </DropdownMenuContent>
    </DropdownMenu>
    //     <Button
    //     className=" bg-slate-100 text-slate-600 font-bold text-md"
    //     size={"lg"}
    //     onClick={() => signOut()}
    //   >
    //     LogOut
    //   </Button>
  );
};

export default SignOut;
