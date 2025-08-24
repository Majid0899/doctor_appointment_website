import jwt  from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const jwtAuthMiddleware=(req,res,next)=>{
    
    //Check the token is present or not
    const authorization=req.headers.authorization;
        if(!authorization) {
            return res.status(401).json({
      success: false,
      errors: ["Access denied. No token provided. Please login first."],
    });
        }

    //Extract the token
    const token=req.headers.authorization.split(' ')[1];
    if (!token) {
    return res.status(401).json({
      success: false,
      errors: ["Malformed authorization header. Use 'Bearer <token>' format."],
    });
  }


    //verify the token
    try {
        //Verify return the payload ---which is user details
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);

        req.user=decoded;        
        next();
        
    } catch (error) {
     if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        errors: ["Session expired. Please login again."],
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        errors: ["Invalid token. Please login again."],
      });
    }
       
    return res.status(500).json({
      success: false,
      errors: ["Something went wrong while verifying token."],
    });
    }
    
}

const generateToken=(userData)=>{
   return  jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn:30000})
}

const generateActionToken = (appointmentId, action) => {
  return jwt.sign(
    { appointmentId, action },
    process.env.ACTION_SECRET,
    { expiresIn: "10m" } 
  );
};

export {jwtAuthMiddleware,generateToken,generateActionToken}