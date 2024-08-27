import express from "express";
import multer from "multer";
import Profile from "../models/profileModel.js";
import Expertise from "../models/profileModel.js";
import LoginData from "../models/login.js";
import cors from "cors";
import { useNavigate } from "react-router-dom";
import Problem from "../models/Problem.js";
import CommunityPosts from "../models/communityPost.js";
import mongoose from "mongoose";
import Comment from "../models/Problemcomments.js";
import Likes from "../models/problemlike.js";
import Message from "../models/Message.js";
import Follow from '../models/Profilefollow.js';
import QueryComment from "../models/comunitycomments.js";
import Notification from "../models/notification.js";
import CollabRequest from "../models/Message.js";

// import upload from "../utils/upload.js";

const router = express.Router();

//API FOR LOGIN
// POST endpoint to store login data
router.post('/api/loginData', async (req, res) => {
  try {
    const loginData = req.body;

    // Check if the login data already exists
    const existingLoginData = await LoginData.findOne({ loginResponse: loginData });

    if (existingLoginData) {
      return res.status(400).json({ message: 'Login data already exists' });
    }

    // Create a new document using the LoginData model
    const newLoginData = new LoginData({ loginResponse: loginData });

    // Save the document to the MongoDB collection
    await newLoginData.save();

    res.status(201).json({ message: 'Login data saved successfully' });
  } catch (error) {
    console.error('Error saving login data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/api/getlogin', async (req, res) => {
  try {
    // Retrieve all login data from the MongoDB collection
    const loginData = await LoginData.find();
    
    res.status(200).json(loginData);
  } catch (error) {
    console.error('Error retrieving login data:', error);
    res.status(500).send('Internal server error');
  }
});

//Problem upload api


// END API FOR UPLOAD PROBLEM

//API FOR FETCHING PROBLEM DETAIL IN PROBLEMDETAIL PAGE
router.get('/api/Problem/:problemId', async (req, res) => {
  try {
    const problemId = req.params.problemId;
    // console.log('Problem ID:', problemId); // Log the problemId for debugging
    // Query the database for problem data based on the problemId
    const problem = await Problem.find({ problemId: problemId });
    // console.log(problem);
    if (!problem) {
      return res.status(404).json({ status: 'error', message: 'Problem not found' });
    }
    res.status(200).json({ status: 'success', data: problem });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch problem' });
  }
});
// API FOR GETTING PROBLEM DETAILS IN FRONTEN PROFILE PAGE
router.get('/api/fetchProblem/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const status = req.query.status; // Get the status query parameter from the request URL

    let problems;
    if (status === 'bookmark' || status === 'notbookmarked') {
      // Query the database for problems data associated with the user's email and matching status
      problems = await Problem.find({ email: userEmail, 'problemDetails.status': status });
     
    } else {
      // If no status query parameter is provided or it's invalid, fetch all problems for the user
      problems = await Problem.find({ email: userEmail });
    }

    // console.log(problems);
    res.status(200).json({ status: 'success', data: problems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch problems' });
  }
});

// API FOR GETTING PROBLEM DETAILS IN FRONTEN home PAGE
router.get('/api/fetchProblem', async (req, res) => {
  try {
    
    // Query the database for problems data associated with the user's email
    const problems = await Problem.find();
    res.status(200).json({ status: 'success', data: problems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch problems' });
  }
});

//fetching problem commment

router.get('/api/comments/:problemId', async (req, res) => {
  try {
    const problemId = req.params.problemId;
    // console.log(problemId);
    const comments = await Comment.find({ problemId: problemId });
    // console.log(comments);
    res.json({ status: 'success', comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch comments' });
  }
});



router.post('/api/comments', async (req, res) => {
  try {
    const { problemId, userName, image, content } = req.body; // Destructure problemId, userName, image, and content from the request body
    const comment = new Comment({ problemId, userName, image, content }); // Create a new Comment document
    await comment.save(); // Save the comment to the database
    res.json({ status: 'success', comment }); // Respond with success status and the saved comment
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ status: 'error', message: 'Failed to post comment' }); // Respond with error status and message
  }
});

///////commentend

//api fro problem owner detail in vewi problem
router.get('/api/ownerprofile/:email', async (req, res) => {
  const email = req.params.email;
  console.log(email);

  try {
    const profile = await Profile.findOne({ email : email });
    // console.log(profile);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ profile });
  } catch (error) {
    console.error("Error fetching profile details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//likes
// Route to handle liking a problem
router.post('/api/problemslike/:problemId/:userId/like', async (req, res) => {
  const { problemId, userId } = req.params;
  console.log(problemId);

  try {
      // Check if the user has already liked the problem
      const existingLike = await Likes.findOne({ problemId, userId });

      if (existingLike) {
          // If like exists, delete it (unlike)
          await Likes.findOneAndDelete({ problemId, userId });
          res.status(200).json({ message: 'Unlike successful' });
      } else {
          // If like doesn't exist, create a new like
          const newLike = new Likes({ problemId, userId });
          await newLike.save();
          res.status(200).json({ message: 'Like successful' });
      }
  } catch (error) {
      console.error('Error liking/unliking problem:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Route to get total likes for each problem
router.get('/api/problemslike/likes', async (req, res) => {
  try {
      const likes = await Likes.aggregate([
          { $group: { _id: '$problemId', totalLikes: { $sum: 1 } } }
      ]);

      res.status(200).json(likes);
  } catch (error) {
      console.error('Error fetching total likes:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


//likes end



//CollaborTION
router.post('/api/send-collab-request', async (req, res) => {

  const { text, senderuserid, receiveruserid, senderId, senderName, senderImg, receiverId, receiverName, receiverImg, problemName,problemid } = req.body;

  try {
    // Create a new collaboration request
    const newRequest = new CollabRequest({
      text,
      senderuserid,
      receiveruserid,
      senderId,
      senderName,
      senderImg,
      receiverId,
      receiverName,
      receiverImg,
      problemName,
      problemid,
      status: 'pending', // Set status to 'pending' by default
    });
    await newRequest.save();

    // Create a new notification
    const notification = new Notification({
      senderuserid,
      receiveruserid,
      receiverId,
      senderId,
      senderName,
      senderImg,
      receiverName,
      receiverImg,
      problemName,
      problemid,
      message: `Collaboration request from <a href="/userprofile/${senderuserid}">${senderName}</a> on problem <a href="/problem/${problemid}">${problemName}</a>`, // Include sender's name and problem name as links
    });
    await notification.save();

    res.status(200).send('Collaboration request sent successfully');
  } catch (error) {
    console.error('Error sending collaboration request:', error);
    res.status(500).send('Internal server error');
  }
});


router.get('/api/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.find({ receiverId: userId, read: false });
 
  res.status(200).json(notifications);
});
router.post('/api/accept-collab-request', async (req, res) => {
  try {
    const { notificationId, senderId , senderimg ,  sendername} = req.body;

    // Logic to update the collaboration request status to accepted
    await Notification.findByIdAndUpdate(notificationId, { status: 'accepted' });

    // Create a notification for the sender
    const acceptNotification = new Notification({
    
    
      receiverId: senderId,
      senderImg:  senderimg,
      senderName:  sendername,
      message: `Your collaboration request has been accepted by ${sendername} `,
      read: false,
      createdAt: new Date(),
    });
    await acceptNotification.save();

    res.status(200).send('Collaboration request accepted successfully');
  } catch (error) {
    console.error('Error accepting collaboration request:', error);
    res.status(500).send('Internal server error');
  }
});

// API to decline collaboration request
router.post('/api/decline-collab-request', async (req, res) => {
  try {
    const { notificationId, senderId , senderimg, sendername } = req.body;

    // Logic to delete the collaboration request
    await Notification.findByIdAndDelete(notificationId);

    // Create a notification for the sender
    const declineNotification = new Notification({
      receiverId: senderId,
      senderImg:  senderimg,
      senderName:  sendername,
      message: `Your collaboration request has been declined by ${sendername}`,
      read: false,
      createdAt: new Date(),
    });
    await declineNotification.save();

    res.status(200).send('Collaboration request declined successfully');
  } catch (error) {
    console.error('Error declining collaboration request:', error);
    res.status(500).send('Internal server error');
  }
});

//collab end

router.get("/api/addProblem", async (req, res) => {
  const problemid = req.query.problemId;
  const problem = await Problem.find({ problemId: problemid });
  res.json(problem);
});

router.post("/api/profileModel", async (req, res) => {
  
  try {
    const profileData = req.body;
    

    const newProfile = new Profile(profileData);

    await newProfile.save();
    // console.log('Received profile data:', profileData);
    res.status(200).json(newProfile);
  } catch (error) {
    console.error("Error saving profile data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//API FOR GETTING EDITPRIFILE IN SIDEBAR
router.get('/api/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Query the database for the profile data associated with the userId
    const profile = await Profile.findOne({ userid: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//api for profile in infobar
router.get('/api/profiles', async (req, res) => {
  try {
    // Query the database to retrieve all profile data
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//FOllowingstart

router.post('/api/follow', async (req, res) => {
  const { follower_username, following_username } = req.body;
  const follow = new Follow({ follower_username, following_username });
  try {
    await follow.save();
    res.status(201).send('Followed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/api/unfollow', async (req, res) => {
  const { follower_username, following_username } = req.body;
  try {
    await Follow.findOneAndDelete({ follower_username, following_username });
    res.status(200).send('Unfollowed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new route to fetch followed users for a specific user with the current user's ID
router.get('/api/followedUsers/:userId/:currentUserId', async (req, res) => {
  const { userId, currentUserId } = req.params;
  try {
    const followedUsers = await Follow.find({ follower_username: currentUserId });
    const isFollowing = followedUsers.some(user => user.following_username === userId);
    res.status(200).json({ followedUsers, isFollowing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/api/following/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const followingUsers = await Follow.find({ follower_username: email });
    
    const followingEmails = followingUsers.map(follow => follow.following_username);
    
    res.status(200).json(followingEmails);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//follow end



//API FOR UPLOADING PROBLEM
router.post("/api/saveProblem", async (req, res) => {
  try {
    // Extract fields from req.body
    const { problemId, email, name, images, inputFields, problemDetails } = req.body;

    // Create a new problem with the extracted data
    const newProblem = new Problem({
      problemId,
      email,
      name,
      images,
      inputFields,
      problemDetails,
    });

    // Save the new problem
    await newProblem.save();

    res.status(200).json({ message: "Problem data saved successfully" });
  } catch (error) {
    console.error("Error saving problem data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// END API FOR UPLOAD PROBLEM

// API FOR GETTING PROBLEM DETAILS IN FRONTEN
router.get("/api/addProblem", async (req, res) => {
  try {
    Problem.find({}, "problemId inputFields image").then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.json({ status: error });
  }
});

router.post("/api/myQueryPosts", async (req, res) => {
  const username = req.body.userEmail;
  console.log(username);
  const sort = { _id: -1 };
  const sorted = await mongoose
    .model("CommunityPosts")
    .find({ authorEmail: username, postType: "QUERY" })
    .sort(sort);
  res.json(sorted);
});

router.get("/api/sortQueryPostsByLatest", async (req, res) => {
  //console.log(req);
  const sort = { _id: -1 };
  const sorted = await CommunityPosts.find({ postType: "QUERY" }).sort(sort);
  // console.log(sorted);
  res.json(sorted);
  //res.sendStatus(200);
});

router.post("/api/addPost", async (req, res) => {
  try {
    const { authorEmail, authorName, autherimage, question, description, postType } = req.body;

    // Check if any required fields are missing
    if (!authorEmail || !authorName || !autherimage || !question || !description || !postType) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Create a new post object
    const newPost = await CommunityPosts.create({
      authorEmail,
      authorName,
      autherimage,
      question,
      description,
      postType,
    });

    console.log("New post created:", newPost);

    // Send a success response
    res.sendStatus(201); // 201 Created status
  } catch (error) {
    // Handle errors
    console.error("Error creating new post:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//get all postquesry

router.get("/api/posts", async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await CommunityPosts.find();

    // Send the posts as a response
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/getdetailquerybyid/:id", async (req, res) => {
  try {
    const qid = req.params.id;
    console.log(qid);
    const resu = await CommunityPosts.findOne({ _id: qid }); // Use the imported model
    console.log(resu);
    if (!resu) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Exclude comments for now
    const { comments, ...postWithoutComments } = resu.toObject();
    res.json(postWithoutComments);
  } catch (error) {
    console.error("Error fetching detail query by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/api/querycomments/:queryId', async (req, res) => {
  try {
    const queryId = req.params.queryId;
    const comments = await QueryComment.find({ queryId });
    res.json({ status: 'success', comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch comments' });
  }
});

router.post('/api/querycomments', async (req, res) => {
  try {
    const { queryId, userid ,userName, image, content } = req.body; // Destructure queryId, userName, image, and content from the request body
    const comment = new QueryComment({ queryId,userid, userName, image, content }); // Create a new QueryComment document
    await comment.save(); // Save the comment to the database
    res.json({ status: 'success', comment }); // Respond with success status and the saved comment
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ status: 'error', message: 'Failed to post comment' }); // Respond with error status and message
  }
});



// GET all queries for a specific user email
router.get('/api/getqueries/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const queries = await  CommunityPosts.find({ authorEmail: userEmail });

    
    res.json({ status: 'success', queries });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch queries' });
  }
});

//related quiry
router.get('/api/getreatedqueries/:related', async (req, res) => {
  try {
    const userEmail = req.params.related; // Corrected parameter name
    const queries = await CommunityPosts.find({ description: userEmail });
    console.log(queries);
    res.json({ status: 'success', queries });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch queries' });
  }
});

router.post("/api/updatePost", async (req, res) => {
  const pid = req.body.pid;
  const comment = req.body.comment;
  const commenterEmail = req.body.commenterEmail;
  const commenterName = req.body.commenterName;
  const post = await mongoose.model("CommunityPosts").findById(pid);

  post.comments.push({
    commenterEmail,
    commenterName,
    comment,
  });
  console.log(post);
  await post.save();
  res.sendStatus(200);
});

router.post("/api/sendNotification", async (req, res) => {
  try {
    const { senderName, senderEmail, receiverEmail, problemId } = req.body;

    const problem = await Problem.findOne({ problemId });

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    const message = `${senderName} wants to collaborate with you on your problem ${problemId}`;

    const newNotification = new Notification({
      senderName,
      senderEmail,
      receiverEmail,
      problem,
      message,
    });

    await newNotification.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Notification sent successfully",
        data: newNotification,
      });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
