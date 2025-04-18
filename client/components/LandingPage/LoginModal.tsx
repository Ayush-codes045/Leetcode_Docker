"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "../ui/button";
import { Tabs, TabsList } from "../ui/tabs";
import RegisterTab from "./RegisterTab";
import LoginTab from "./LoginTab";
import AuthOptions from "./AuthOptions";

const LoginModal = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className=" bg-slate-100 text-slate-600 font-bold text-md"
          size={"lg"}
        >
          Login
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Tabs defaultValue="Login" className="">
          <AlertDialogHeader className=" pt-3 pb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className=" text-slate-600" value="Login">Login</TabsTrigger>
              <TabsTrigger className=" text-slate-600"  value="Register">Register</TabsTrigger>
            </TabsList>
          </AlertDialogHeader>
          <TabsContent value="Login">
            <LoginTab />
          </TabsContent>
          <TabsContent value="Register">
            <RegisterTab/>
          </TabsContent>
        </Tabs>
      <AlertDialogFooter>
        <AuthOptions />
      </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginModal;
