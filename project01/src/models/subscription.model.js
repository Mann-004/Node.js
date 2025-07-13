import mongoose from "mongoose"
const subscriptionSchema = new schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps: true
})

export const subscription = mongoose.model(
    "subscription",
    subscriptionSchema
)