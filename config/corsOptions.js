import { allowedOrigins } from "./allowedOrigins.js";

const corsOptions = {
  origin: function (origin, callback) {
    console.log("origin: ", origin)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
