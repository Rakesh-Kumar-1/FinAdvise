//Centrslixed eror handling

export const errorHandling = (err,req,res,next)=> {
    console.log(err.stack);
     return res.status(500).json({
        status: 500,
        message: "Something went wrong",
        error: err.message,
    });
}