import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/app/model/user"
import { registerSchema } from "@/app/schemas/registerSchema"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    
    // Validate request body
    const validation = registerSchema.safeParse({
      ...body,
      confirmPassword: body.password, // Skip confirmation check on server
    })

    if (!validation.success) {
      return NextResponse.json(
        { 
          message: "Invalid input data",
          errors: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { username, email, password } = body

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    })

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "email" : "username"
      return NextResponse.json(
        { 
          message: `User with this ${field} already exists`,
          field 
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = new UserModel({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
    })

    await newUser.save()

    // Return success without sensitive data
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isVerified: newUser.isVerified,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    
    // Handle MongoDB duplicate key error
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}