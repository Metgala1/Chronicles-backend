const prisma = require("../client/pool")

exports.createPost = async (req, res) => {
  try {
    const { title, content, published } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const publishedBoolean = published === 'true';

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published: publishedBoolean,
        imageUrl,
        authorId: req.user.id,
      },
    });

    return res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ error: err.message });
  }
};


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;

        const posts = await prisma.post.findMany({
            take: parseInt(limit, 10),
            skip: parseInt(offset, 10),
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: { select: { id: true, username: true } },
                comments: true
            }
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
}


exports.getPostById = async (req,res) => {
    try {
        const { id } = req.params;

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: {
                author: { select: { id: true, username: true } },
                comments: true
            }
        });

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message }); // use err here
    }
};


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


exports.togglePublish = async (req,res) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;

        const post = await prisma.post.findUnique({
            where: {id: Number(id)}
        })

        if(!post){
            return res.status(404).json({message: "Post not found"})
        }

        if(post.authorId !== req.user.id){
            return res.json({message: "Not authorized"})
        }

        const updatePost = await prisma.post.update({
            where: {id: Number(id)},
            data: {published: !post.published}
        });

        res.json({
              message: `Post is now ${updatedPost.published ? "published" : "unpublished"}`,
              post: updatePost
        });
    }catch(err){
        console.error(err)
        res.status(500).json({message: "Failed to toggle published", error: error.message})
    }
}