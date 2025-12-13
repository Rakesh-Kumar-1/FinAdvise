import jwt from 'jsonwebtoken'

export const isAuthenticated = async (req,res,next) =>{
    try{
        if(req.path=="/user/login" || req.path=="/user/register"){
            return next();
        }
        const token = req.cookies.token;
        console.log(token);
        if(!token){
            return res.status(401).json({message:"User not authenticated"});
        }
        const decode = jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({message:"Invalid token"});
        }
        req.decode = decode;
        next();
    }
    catch(error){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}