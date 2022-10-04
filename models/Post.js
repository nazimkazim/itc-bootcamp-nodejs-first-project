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
    comments: {
        type: [String],
        default:[]
    },
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
    likes:{
        type:[String],
        default:[]
    }
}, {timestamps: true});

export default mongoose.model("Post", PostSchema);