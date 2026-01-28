// "use client"
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import {
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogDescription,
//     AlertDialogFooter
// } from "@/components/ui/alert-dialog";
// import { FcGoogle } from "react-icons/fc";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from "@/components/ui/form";
// import { RxGithubLogo } from "react-icons/rx";
// import { Input } from "@/components/ui/input";
// import { Button } from "../ui/button";
// import AuthOptions from "./AuthOptions";
// import { Register } from "@/actions/register";
// import { signIn } from "next-auth/react";
// import { RegisterTypes } from "@/types";
// const formSchema = z.object({
//     username: z.string().min(2, {
//       message: "Username must be at least 2 characters.",
//     }),
//     email: z.string().email(),
//     password: z.string().min(10, {
//       message: "Password must be at least 10 characters.",
//     }),
//   });
// const RegisterTab = () => {
//       // 1. Define your form.
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       username: "",
//       email: "",
//       password: "",
//     },
//   });

//   // 2. Define a submit handler.
//   // async function onSubmit(values: z.infer<typeof formSchema>) {
//   //   const val = RegisterTypes.safeParse(values)
//   //   if (!val.success) {
//   //     return
//   //   }
//   //   await Register(values)
//   //   const {email,password} = val.data
//   //   await signIn("credentials", {email, password, callbackUrl: "/"})
//   // }

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const val = RegisterTypes.safeParse(values)
//     if (!val.success) {
//       return
//     }
//     await Register(values)
//     const {email, password} = val.data
    
//     // Use window.location.origin to get the current domain
//     const callbackUrl = `${window.location.origin}/`
//     await signIn("credentials", {
//       email, 
//       password, 
//       callbackUrl,
//       redirect: true
//     })
//   }
//   return (
//     <AlertDialogDescription>
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="Username" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="Email" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input placeholder="Password" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <AlertDialogFooter>
//         <AlertDialogCancel className="p-0">
//           <Button
//             className="hover:bg-slate-900 hover:text-slate-200 text-slate-900 bg-slate-200 font-bold text-md"
//             size={"lg"}
//           >
//             Cancel
//           </Button>
//         </AlertDialogCancel>
//         <AlertDialogAction className="p-0">
//         <Button
//           type="submit"
//           className="bg-slate-900 text-slate-200 hover:text-slate-900 hover:bg-slate-200 font-bold text-md"
//           size={"lg"}
//         >
//           Register
//         </Button>
//           </AlertDialogAction>
//         </AlertDialogFooter>
        
//       </form>
//     </Form>
//   </AlertDialogDescription>
//   )
// }

// export default RegisterTab

"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { Button } from "../ui/button";
import { Register } from "@/actions/register";
import { signIn } from "next-auth/react";
import { RegisterTypes } from "@/types";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log("Starting registration for:", values.email);
      
      const val = RegisterTypes.safeParse(values)
      if (!val.success) {
        console.error("Validation failed:", val.error);
        toast.error("Please check your inputs");
        setIsLoading(false);
        return;
      }
      
      const result = await Register(values);
      console.log("Registration result:", result);
      
      if (!result) {
        toast.error("Registration failed - no response");
        setIsLoading(false);
        return;
      }

      if (result.success === false) {
        toast.error(result.error || "Registration failed");
        setIsLoading(false);
        return;
      }
      
      toast.success("Account created! Logging you in...");
      
      const { email, password } = val.data;
      
      // Use current domain for callback
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const callbackUrl = `${baseUrl}/`;
      
      console.log("Attempting sign in with callback:", callbackUrl);
      
      const signInResult = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: true
      });
      
      if (signInResult?.error) {
        console.error("Sign in error:", signInResult.error);
        toast.error("Login failed. Please try logging in manually.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
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
                  <Input placeholder="Username" {...field} disabled={isLoading} />
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
                  <Input type="email" placeholder="Email" {...field} disabled={isLoading} />
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
                <FormLabel>Password (min 10 characters)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="p-0" disabled={isLoading}>
              <Button
                type="button"
                className="hover:bg-slate-900 hover:text-slate-200 text-slate-900 bg-slate-200 font-bold text-md"
                size={"lg"}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-slate-900 text-slate-200 hover:text-slate-900 hover:bg-slate-200 font-bold text-md"
              size={"lg"}
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </AlertDialogDescription>
  )
}

export default RegisterTab