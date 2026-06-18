const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
{
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    sessionTitle:{
        type:String,
        
    },

    aiTitle:{
        type: String
    },
    
    originalText:{
        type:String,
        default:""
    },

    summary: {
    type: [String],   // array of bullet points
    default: []
    },

quiz: {
    type: [
        {
            question: String,
            options: [String],
            answer: String
        }
    ],
    default: []
}

},
{timestamps:true}
);

module.exports = mongoose.model("Session", sessionSchema);