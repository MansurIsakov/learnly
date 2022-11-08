// import { ClientErrorException } from "@common/utils/appError";
// import { env } from "@env";
// import { Middleware } from "@type";
// import { NextFunction, Request, Response as EResponse } from "express";
// import jwt from "jsonwebtoken";

// type UserRequest = Request & { user: any };

// export const userHandler = (
//   req: UserRequest,
//   res: EResponse,
//   next: NextFunction
// ): Middleware => {
//   const authToken: any =
//     req.headers["Authorization"] || req.headers["authorization"];

//   if (authToken) {
//     try {
//       const decoded = jwt.verify(authToken, env.JWT_SECRET);
//       req.user = decoded;

//       next();
//     } catch (error) {
//       req.user = null;

//       throw new ClientErrorException({
//         message: "Failed to find user",
//       });
//     }
//   } else {
//     req.user = null;

//     throw new ClientErrorException({
//       message: "Failed to find user",
//     });
//   }
// };
