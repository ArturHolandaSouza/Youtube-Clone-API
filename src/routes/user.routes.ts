import { Router } from "express";
import { UserRepository } from "../modules/user/repositories/UserRepository";
import { login } from "../middleware/login";

const userRoutes = Router();
const userRepository = new UserRepository

userRoutes.post('/sign-up', (request,response) =>{
    userRepository.create(request, response);
})
userRoutes.post('/sign-in', (request,response) =>{
    userRepository.login(request, response);
})
userRoutes.get('/get-user', login, (request,response) =>{
    userRepository.getUser(request, response);
})

export { userRoutes }