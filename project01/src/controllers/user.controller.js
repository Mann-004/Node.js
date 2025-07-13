import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import path from "path"

const genarateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findOne(userId)
        // console.log(user)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefereshToken()

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong ehile genrating access and refresh token")
    }

}

const registerUser = asyncHandler(async (req, res) => {

    //    get details from users
    //    validations - not empty
    //    check if user already register
    //    check for images ,check for avatar
    //    upload to cloudinary
    //    create user object - create entry in db
    //    remove password and refresh token field  from response
    //    check for user creation
    //    return response


    const { fullname, email, password, username } = req.body
    // console.log("email :", email)

    if ([fullname, email, password, username].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(404, "All fields are reqired")

    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }


    // const avatarLocalPath = path.normalize(req.files?.avatar?.[0]?.path).replace(/\\/g, "/");

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // console.log("avatar",req.files)

    // console.log(avatarLocalPath)



    // const coverImageLOcalPath = req.files?.coverImage[0]?.path

    let coverImageLOcalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLOcalPath = path.normalize(req.files?.coverImage?.[0]?.path).
            replace(/\\/g, "/")


    }
    else {
        coverImageLOcalPath = null
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")

    }
    // console.log("avtarlocalpath", avatarLocalPath)

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    // console.log(avatar)

    const coverImage = await uploadOnCloudinary(coverImageLOcalPath)

    // there is problem of Avatar is required occurs due to the cloundinary sercet key 
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken "
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while regsitring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username and email 
    // find the user
    // password check 
    // aceess and refresh token
    // send cookie

    const { email, username, password } = req.body
    // console.log("email:", email,"password:",password)

    // chance the code for login user check
    if (!username && !email) {
        throw new ApiError(400, "email or username is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // password check
    const isPasswordValide = await user.isPasswordCorrect(password)

    if (!isPasswordValide) {
        throw new ApiError(404, "Password is incorrect")
    }

    const { accessToken, refreshToken } = await genarateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // console.log(loggedInUser)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
        status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            },
                "User logged in successfully"
            )
        )

})

const loggoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: "" } }, // Correct way to remove refreshToken
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshAccessToken

        if (incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh Token")
        }

        if (!incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true

        }

        await genarateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Inavalid refresh token")
    }
})

const changeCureenetPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res.json(new ApiResponse(200, {}, "Password changed"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User found"))

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "Please provide all fields")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullname, email

            }
        },
        {
            new: true,
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated succesfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Avatar upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true,
        }
    ).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated succesfully"))


})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (coverImageLocalPath) {
        throw new ApiError(400, "CoverImage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "CoverImage upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coveImage: coverImage.url
            }
        },
        {
            new: true,
        }
    ).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, user, "CoverImage updated succesfully"))


})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: 'subscription',
                localField: '_id',
                foreignField: 'channel',
                as: "subscribers"
            }

        },
        {
            $lookup: {
                from: 'subscription',
                localField: '_id',
                foreignField: 'subscriber',
                as: "subscribedTo"
            }

        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname:1,
                username:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1
            }
        }
    ])
   console.log("channel : ",channel)

   if(!channel?.length){
    throw new ApiError(404,"channel does not exists")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200,channel[0],"User channel fecthed successfully")
   )
})



export {
    registerUser,
    loginUser,
    loggoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    changeCureenetPassword,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile
}