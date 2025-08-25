const LocalStrategy = require("passport-local").Strategy
const prisma = require("../client/pool")
const bcrypt = require("bcryptjs")

function initialize (passport){
    passport.use(new LocalStrategy({usernameField: "email"},async (email, password, done) => {
        try{
         const user = await prisma.user.findUnique({
            where: {email: email}
         })
         if(!user){
            return done(null, false, {message: "User does not exist"})
         }
         const isMatch = await bcrypt.compare(password, user.password);
         if(!isMatch){
            return done(null, false, {message: "Incorect password"})
         }
          return done(null, user)
         }catch(err){
            console.error(err)
            return done(err)
         }

    }))

    passport.serializeUser(async (user, done) => {
         done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try{
        const user = await prisma.user.findUnique({where: {id: id}})
        done(null, user)
        } catch(err){
            done(err)
        }
    })
}

module.exports = initialize