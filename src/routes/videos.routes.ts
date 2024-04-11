import { Router } from "express";
import { VideoRepository } from "../modules/videos/repositories/VideosRepository";
import { login } from '../middleware/login';

const videosRoutes = Router();
const videoRepository = new VideoRepository;

videosRoutes.post('/create-video', login, (request,response) =>{
    videoRepository.create(request,response);
})

videosRoutes.get('/get-videos', login, (request,response) =>{
    videoRepository.getVideos(request,response);
})

videosRoutes.get('/search-videos', (request,response) =>{
    videoRepository.searchVideos(request,response);
})

export { videosRoutes }