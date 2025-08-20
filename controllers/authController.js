const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../client/pool");

exports.register = async (req , res) => {
    try{
        const  {username, email, password, role} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if(existingUser){
            return res.status(400).json({error: "User already exist"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       const user =  await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                role: role,
                email: email
            }
        })
        res.json({message: "User created successfully", user})

    }catch(err){
        console.error(err)
        res.status(500).json({message: "Something went wrong"})

    }
};

exports.login =  async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(!user){
            res.status(400).res.json({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            res.status(400).json({message: "Incorrect password"})
        }

        const token = jwt.sign({
            id: user.id, role: user.role,
        }, process.env.SECRET_KEY, {expiresIn: "1h"})

        res.json({message: "Login succesful", token})
    }catch(err){
        console.error(err)
        res.status(500).json({error: "Something went wrong"})
    }

}