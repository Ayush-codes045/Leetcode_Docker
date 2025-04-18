"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { FcGoogle } from "react-icons/fc";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { RxGithubLogo } from "react-icons/rx";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import AuthOptions from "./AuthOptions";
import { Register } from "@/actions/register";
import { signIn } from "next-auth/react";
import { RegisterTypes } from "@/types";
const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(10, {
      message: "Password must be at least 10 characters.",
    }),
  });
const RegisterTab = () => {
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const val = RegisterTypes.safeParse(values)
    if (!val.success) {
      return
    }
    await Register(values)
    const {email,password} = val.data
    await signIn("credentials", {email, password, callbackUrl: "/"})
  }
  return (
    <AlertDialogDescription>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
        <AlertDialogCancel className="p-0">
          <Button
            className="hover:bg-slate-900 hover:text-slate-200 text-slate-900 bg-slate-200 font-bold text-md"
            size={"lg"}
          >
            Cancel
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction className="p-0">
        <Button
          type="submit"
          className="bg-slate-900 text-slate-200 hover:text-slate-900 hover:bg-slate-200 font-bold text-md"
          size={"lg"}
        >
          Register
        </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
        
      </form>
    </Form>
  </AlertDialogDescription>
  )
}

export default RegisterTab