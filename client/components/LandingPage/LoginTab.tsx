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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { LoginTypes } from "@/types";
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10, {
      message: "Password must be at least 10 characters.",
    }),
  });
const LoginTab = () => {
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {email,password} = values
    signIn("credentials", { email,password, callbackUrl: "/"})
  }
  return (
    <AlertDialogDescription>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
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
          Login
        </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
        
      </form>
    </Form>
    
  </AlertDialogDescription>
  )
}

export default LoginTab