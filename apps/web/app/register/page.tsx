"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { registerSchema, type RegisterInput } from "@chat/shared-types";
import { useEffect } from "react";

export default function RegisterPage(){
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    const firstError = Object.values(errors)[0];

    if(firstError?.message){
      toast.error(firstError.message);
    }
  }, [errors])

  async function onSubmit(data: RegisterInput) {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.push("/login");
    } catch{
        toast.error("Something went wrong")
    }
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Username" {...register("username")} />
      <input placeholder="Email" {...register("email")} />
      <input type="password" placeholder="Password" {...register("password")} />

      <button type="submit">
        Register
      </button>
    </form>
  );
}
