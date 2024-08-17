import { z } from "zod";

interface User {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

type ExistingUser = Pick<User, "email" | "password">;

export function validateNewUser(userData: User) {
    const userSchema = z.object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(20, {
          message: "Name must be less than 20 characters long",
        }),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
      }),
      phoneNumber: z
        .string()
        .min(10, { message: "Please enter a valid phone number" })
        .max(10),
    });
  
    const check = userSchema.safeParse(userData);

    if(check.success){
      return check.data;
    }

    return userSchema.safeParse(userData).error?.issues[0].message;
}

export function validateExistingUser(useData: ExistingUser) {
    const userSchema = z.object({
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
      }),
    });
  
    const check = userSchema.safeParse(useData);

    if(check.success){
      return check.data;
    }

    return userSchema.safeParse(useData).error?.issues[0].message;
}