import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from 'jsonwebtoken';
import { jwtVerify } from "jose";

export const middleware = async (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1]; // 提取 token

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );    
    if (Date.now() >= payload.exp! * 1000) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    return;
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
};

export const config = {
  matcher: "/api/config",
};
