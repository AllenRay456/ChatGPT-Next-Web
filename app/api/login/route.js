import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, password } = await req.json();
  try {
    const { rows } = await sql`SELECT * FROM userInfo WHERE name = ${name}`;
    const user = rows[0];
    console.log(user);
    console.log(Date.now());

    if (user && user.password === password) {
      if (Date.now() < user.endtime * 1000) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        return NextResponse.json({ token: token, name }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Access denied. Account expired." },
          { status: 403 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
