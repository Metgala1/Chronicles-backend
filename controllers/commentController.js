const prisma = require("../client/pool");

exports.createComment = async (req,res) => {
    try{
        const {postId} = req.params;
        const {content} = req.body;
        const userId = req.user?.id;

        if(!content){
            return res.status(400).json({message: "Comment content is required"});
        }
        const post = await prisma.post.findUnique({
            where: {id: Number(postId)}
        });

        if(!post){
            return res.status(404).json({message: "Post not found"})
        }
        const comment = await prisma.comment.create({
            data: {
                content: content,
                postId: Number(postId),
                userId: userId || null
            }
        })

        res.status(201).json({message: "Comment created successfully", comment})

    }catch(err){
        console.error(err)
    }
}

exports.getCommentsByPost = async (req,res) => {
    try{
        const {postId} = req.params;
        const comments = await prisma.comment.findMany({
            where: {postId: Number(postId)},
            include: {
                user: {select: {id: true, username: true}},
            },
            orderBy: {createdAt: "asc"}
        })

        res.json(comments);

    }catch(err){
        console.error(err)
        res.status(500).json({message: "Failed to fetch comments", error: error.message});

    }
}

exports.deleteComment = async (req,res) => {
    try{
        const {id} = req.params;
        const userId = req.user.id;

        const comment = await prisma.comment.findUnique({
            where: {
                id: Number(id)
            },
            include: {post: true},
        })

        if(!comment){
            return res.status(404).json({message: "Comment not found"})
        }

        if(comment.userId !== req.user.id){
            return res.status(403).json({message: "Not authorized to delete this comment"})
        }
       await prisma.comment.delete({
        where: {id: Number(id)}
       })
       res.json({message: "Comment deleted successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Faild to delete comment", error: error.message})
    }
}