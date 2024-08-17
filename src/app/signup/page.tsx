"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ButtonLoader from "@/components/loaders/ButtonLoader"
import { signIn } from "next-auth/react";
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { signUp } from "../actions/user"
import { useRouter } from "next/navigation"
import bcrypt from "bcryptjs"

import {validateNewUser} from "@/lib/validation"


export default function Page() {

  const { toast } = useToast()
  const router = useRouter()



  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: ""
  })

  const [loading, setLoading] = useState(false);
  
  const clickHandler = async () => {
    setLoading(true)
    const {name, email, phoneNumber, password} = user
    const hashPass = bcrypt.hashSync(user.password, 10)
    const isSignUp = await signUp(name, phoneNumber, email, hashPass);
    if(isSignUp?.message){
      toast({
        description: isSignUp?.message,
        variant: "destructive"
      })
      setLoading(false)
      return
    }
    if (isSignUp && Object.keys(isSignUp).length) {
      await signIn('credentials', { email: isSignUp.email, password: isSignUp.password, redirect: false })
      toast({
        title: "Successfully Signed up"
      })
      setLoading(false)
      router.push("/")
      return
    }

    toast({
      description: "User already exists with the same email or phone number! Please sign in",
      variant: "destructive"
    })

  }

  return (
    <Card className="mt-10 mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up to Mind Canvas</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
         
        <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid col-span-2 gap-2">

                <Label htmlFor="first-name">Name</Label>
                <Input
                  value={user.name}
                  onChange={
                    (e) => setUser({...user, name: e.target.value})
                  }
                  type="text"
                  id="first-name" placeholder="Max" required />
              </div>

            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                value={user.phoneNumber}
                onChange={
                  (e) => setUser({...user, phoneNumber: e.target.value})
                }
                id="phone"
                type="text"
                placeholder="1234567980"
                required
                maxLength={10} 
                minLength={10}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={user.email}
                onChange={
                  (e) => setUser({...user, email: e.target.value})
                }
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                value={user.password}
                onChange={
                  (e) => setUser({...user, password: e.target.value})
                }
                id="password" type="password" />
            </div>
            <Button
            type="submit"
              onClick={clickHandler}
              disabled={loading}
              className="w-full">
              {
                loading ? <ButtonLoader /> : "Sign Up"
              }
            </Button>

        </div>
         
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
