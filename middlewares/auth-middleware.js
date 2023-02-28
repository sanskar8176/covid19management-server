import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'
import StateModel from '../models/State.js'

var checkUserAuth = async (req, res, next) => {
  let token
  // console.log("middleware me re", req.headers)
  const { authorization } = req.headers;
  const { state, id='' } = req.params;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

      // Get User from Token
      const user = await UserModel.findById(userID).select('-password')
      if(id){
        const data = await StateModel.findById(id)
        if( user.role !=='admin' &&  data.state !== user.state){
          return res.status(401).send({ "status": "failed", "message": "Unauthorized state access" });
        }
      }


      // if(user.state!=state){
      //   console.log(user.state , state, "in middleware")
      //     return res.status(401).send({ "status": "failed", "message": "Unauthorized User" });
      // }
      
      req.user = user;
      next()
    } catch (error) {
      // console.log(error)
      return res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}



export default checkUserAuth