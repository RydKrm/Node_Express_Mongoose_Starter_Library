import jwt, { JwtPayload } from "jsonwebtoken";
import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

export function generateAccessToken(role: string, user_id: string) {
  const id = user_id;
  let secretKey = "";
  if (role === "admin") {
    secretKey = process.env.ADMIN_SECRET as string;
  } else if (role === "manager") {
    secretKey = process.env.MANAGER_SECRET as string;
  } else if (role === "counselor") {
    secretKey = process.env.COUNSELOR_SECRET as string;
  } else if (role === "email") {
    secretKey = process.env.EMAIL_SECRET as string;
  }
  return jwt.sign({ id, role }, secretKey);
}

// Forget generate password token
export const generateForgetPasswordToken = (role: string, id: string) => {
  return jwt.sign({ id, role }, process.env.EMAIL_SECRET as string, {
    expiresIn: "5m",
  });
};

enum Role {
  admin,
  manager,
  counselor,
}

interface JwtRole extends JwtPayload {
  id: string;
  role: Role;
}

interface RequestUpdate extends Request {
  role?: Role;
  user?: { _id: string; role: Role };
  admin?: string;
  manager?: string;
  counselor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const auth = (roles: Role[] | Role = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return async (req: RequestUpdate, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return next(createError(403, "Authorization token is required"));
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    try {
      const isVerified = (await jwt.verify(
        token,
        process.env.TOKEN_SECRET as string
      )) as JwtRole;

      if (!isVerified) {
        return next(createError(403, "Invalid Token"));
      }

      if (Array.isArray(roles) && roles.length > 0) {
        if (roles.includes(isVerified.role)) {
          req[Role[isVerified.role]] = {
            _id: isVerified.id,
            role: isVerified.role,
          };
          req.role = isVerified.role;
          req.user = { _id: isVerified.id, role: isVerified.role };
          next();
        } else {
          return next(
            createError(403, `Only ${roles.toString()} can do this request.`)
          );
        }
      } else {
        req[Role[isVerified.role]] = {
          _id: isVerified.id,
          role: isVerified.role,
        };
        next();
      }
    } catch (error) {
      return next(error);
    }
  };
};

// authorization error handler for authorization errors;
export const authorize = (roles: Role | Role[] = []) => {
  // covert single string to array with same name as roles
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req: RequestUpdate, res: Response, next: NextFunction) => {
    try {
      // get the authorization token from the request header
      const tokenWithBearer = req.header("Authorization");

      if (!tokenWithBearer) return res.status(401).send("Access denied.");

      // split the token from the bearer
      const newToken = tokenWithBearer.split(" ")[1];

      // verify the token
      const verified = jwt.verify(
        newToken,
        process.env.TOKEN_SECRET as string
      ) as JwtRole;

      // assign the verified token to the request object auth property
      req.auth = verified; // set the request "authorized" property with the validation result
      req.role = verified.role; // set the request "authorized" property with the validation result

      // check if is roles is in the roles array
      if (
        Array.isArray(roles) &&
        roles.length > 0 &&
        !roles.includes(verified.role)
      ) {
        return res.status(401).send("Access Denied");
      }
      next();
    } catch (err) {
      console.log(err);
      return res.status(501).json(err);
    }
  };
};
