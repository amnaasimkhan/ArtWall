import db from "../config/dbConnection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

//dont touch this its working just fine

export const register = async (req, res) => {        
  try {
    // check if user already exists
    const [exists] = await db.query(
      "SELECT * FROM users WHERE email = ? OR name = ?",
      [req.body.email, req.body.name]
    );

    if (exists.length) {
      return res.status(409).json("User already exists!");
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const pw_hash = bcrypt.hashSync(req.body.password, salt);

    // insert new user
    // Public sign-up always creates a customer. Admin accounts are created only by
    // scripts/createAdmin.js (run at deploy time), so nobody can register as "admin".
    const role = "customer";
    const values = [ req.body.name,
                     req.body.email,
                     role,
                     pw_hash ]

    const result = await db.query(
      "INSERT INTO users (`name`, `email`, `role`,`password`) VALUES (?,?,?,?)", values
    );
    if (role === "customer") {
      const user_id = result[0].insertId;
      await db.query(
        "INSERT INTO carts (`user_id`) VALUES (?)", [user_id]
      )  
    }
    
    return res.status(200).json("User registered successfully"); //lesgoo

  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json(error); 
  }
};


export const login = async(req,res)=>{    

    try {

      //check if user exists
      const [exists] = await db.query(
        "SELECT * FROM users WHERE name = ? && role = ?",
        [req.body.name, req.body.role]
      );

      if (!exists.length) {
        return res.status(404).json("User does not exist!");
      }

      //compare pw
      const isCorrect = bcrypt.compareSync(req.body.password, exists[0].password);
     
      if (!isCorrect) {
        return res.status(401).json("Wrong credentials!");
      }
      
      //if correct then create session
      //JWT STUFF LESGOOOO

      const token = jwt.sign(        //create token
        {
          id:exists[0].user_id,     
          role:exists[0].role,      
        },
        process.env.JWT_SECRET_KEY ,    //key for hashing in .env file
        { expiresIn: "24h" }
      ) 
      

      return res.status(200).json({
        message: "Login successful",
        token,
        user:  {
          id:exists[0].user_id,     
          role:exists[0].role,
          email: exists[0].email,
          role: exists[0].role,
        }
      });       //we send the other to the frontend so it can display your name email etc

      //every new request, this stuff will be attached manually in header

    } catch (error) {
      console.error("Error loggin in:", error);
      return res.status(500).json(error);
    }
}

//didnt neeed this anymore cuz no cookies 
// export const logout =(req,res)=>{
//   try {
//     //delete jwt
//     res.clearCookie("token",{
//       httpOnly:true ,
//       sameSite:"none",
//       secure:false,
//     }).status(200).json("User has been logged out!")

//   } catch (error) {
//     console.error("Error logging out:", error);
//     return res.status(500).json(error);
//   }
    
//}



