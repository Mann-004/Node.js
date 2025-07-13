import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcyrpt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true

        },
        avatar: {
            type: String,
            required: true,

        },
        coverImage: {
            type: String,

        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refreshToken: {
            type: String
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    },
    {
        timestamps: true
    }
)
// in this pre fun. * not use arrow fun. buz the arrow fun. does not know the context (this method)


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcyrpt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcyrpt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullnmae: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefereshToken = function () { 
    return jwt.sign(
        {
            _id: this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}
export const User = mongoose.model("User", userSchema)