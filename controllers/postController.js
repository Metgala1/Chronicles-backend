const prisma = require("../client/pool")

exports.createPost = async (req, res) => {
    try{
        const {title, content} = req.body;

        if(!title || !content){
            return res.status(400).json({message: "Title and content are required"})
        }

        const newPost = await prisma.post.create({
            data:{
                title: title,
                content: content,
                authorId: req.user.id,
            }
        });
        res.status(201).json(newPost)
    }catch(err){
        console.error(err)
        res.status(500).json({error: error.message})
    }
};

exports.getAllPosts = async (req,res) => {
    try{
        const posts = await prisma.post.findMany({
            include: {
                author: {select: {id: true, username: true}},
                comments: true
            }
        })
        res.json(posts)
    }catch(err){
        console.error(err);
        res.status(500).json({error: error.message});
    }
}

exports.getPostById = async (req,res) => {
    try{
        const {id} = req.params

        const post = await prisma.post.findUnique({
            where: {id: Number(id)},
            include: {
                author: {select: {id: true, username: true}},
                comments: true
            }
        })
    }catch(err){
        console.error(err)
        res.status(500).json({error: error.message})
    }
}

exports.updatePost = async (req,res) => {
    try{
        const {id} = req.params;
        const {title, content} = req.body;

        const existingPost = await prisma.post.findUnique({
            where: {id: Number(id)},
        })

        if(!existingPost){
            return res.status(404).json({message: "Post not found"})
        }

        if(existingPost.authorId !== req.user.id){
            return res.status(403).json({message: "Unauthorized"})
        }

        const updatePost = await prisma.post.update({
            where: {id: Number(id)},
            data: {
                title: title,
                content: content
            }
        })
        res.json(updatePost)
    }catch(err){
        console.error(err)
        res.status(500).json({error: error.message})
    }
}

exports.deletePost = async (req,res) => {
    try{
        const {id} = req.params;
        const existingPost = await prisma.post.findUnique({
            where: {id: Number(id)}
        });
        if(!existingPost){
            return res.status(404).json({message: "Root not found"})
        }

        if(existingPost.authorId !== req.user.id){
            return res.status(403).json({message: "Unauthorized"})
        }

        await prisma.post.delete({
            where: {id: Number(id)}
        })
        res.json({message: "Post dleted succesfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({error: error.message})
    }
}