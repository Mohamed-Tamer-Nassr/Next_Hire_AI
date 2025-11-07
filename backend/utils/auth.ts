import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { IUser } from "../config/models/user.model";
// backend/utils/auth.ts
export const getCurrentUser = async (request: Request) => {
  const nextReq = new NextRequest(request.url, {
    headers: request.headers,
    method: request.method,
  });
  const session = await getToken({
    req: nextReq,
  });

  // console.log("user->>>>", session);

  if (!session || !session.id) {
    throw new Error("Unauthorized");
  }

  // ✅ Map session.id to _id for IUser compatibility
  return {
    ...session,
    _id: session.id, // Add _id field
  } as unknown as IUser;
};
