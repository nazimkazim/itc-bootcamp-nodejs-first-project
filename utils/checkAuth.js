import jwt from "jsonwebtoken";

export const checkAuth = (
    req ,
    res ,
    next
  ) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "you are not authentificated"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(createError(403, "Token is not valid "));
      req.user = user;
      next();
    });
  };