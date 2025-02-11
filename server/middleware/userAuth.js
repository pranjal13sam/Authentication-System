//this is the middleware that will find the userId from the token and that userId we will send for verification:
import jwt from 'jsonwebtoken'

 const userAuth=async(req,res,next)=>{
    const {token}= req.cookies;
    
    if(!token){
        return res.json({success:false,message:'Not Authorized Login Again!'})
    }

    try{
        //this is for decoding the token
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)

        if(tokenDecode.id){
             req.body.userId=tokenDecode.id
        }
        else{
            return res.json({
                success:false,message:'Not Authorized Login Again!'
            })
        }

        next()
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export default userAuth;