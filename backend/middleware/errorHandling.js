//Centrslixed eror handling

export const errorHandling = (err,req,res,next)=> {
    console.log(err.stack);
     return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || "Something went wrong",
    });
}