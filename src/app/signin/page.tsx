"use client"
import React, { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast";
import ButtonLoader from '@/components/loaders/ButtonLoader'

export default function page() {
  
  const router = useRouter();
  const {toast} = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const clickHandler = async () => {
    setLoading(true)
   const sign =  await signIn('credentials', {
      email, password, redirect: false
    })
    if(sign?.error){
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "Please check your email and password and try again."
      })
      setLoading(false)
      return
    }
    setLoading(false)
    router.push("/")
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
  }

  return (
    <Card className="mx-auto max-w-sm mt-20">
    <CardHeader>
      <CardTitle className="text-2xl">Login</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <Link href="#" className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link> */}
          </div>
          <Input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password" type="password" required />
        </div>
        <Button
          onClick={clickHandler}
          disabled={loading}
        type="submit" className="w-full">
          {
            loading ? <ButtonLoader /> : "Login"
          }
        </Button>
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </CardContent>
  </Card>

  )
}

