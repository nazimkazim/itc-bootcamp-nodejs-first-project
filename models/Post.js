import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    }, 
    description: {
        type:String,
        required: true,
    },
    comments: [{
        type: String,
    }],
    author: {
        type: String,
    },
    img:{
        type: String,
        required: true,
    },
    views:{
        type: Number,
        default: 0,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]
}, {timestamps: true});

export default mongoose.model("Post", PostSchema);