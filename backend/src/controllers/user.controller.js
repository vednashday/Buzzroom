import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res){

    try{
        const currentUser = req.user;

    const allUsers = await User.find({
      _id: { $ne: currentUser.id },
      isOnboarded: true,
    }).select("fullName email profilePic _id");

    const outgoingRequests = await FriendRequest.find({
      sender: currentUser.id,
      status: "pending",
    }).select("recipient");

    const outgoingIds = outgoingRequests.map(req => req.recipient.toString());
    const friendIds = currentUser.friends.map(friend => friend.toString());

    const filteredUsers = allUsers.filter(
      user =>
        !friendIds.includes(user._id.toString()) &&
        !outgoingIds.includes(user._id.toString())
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res){

    try{
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends","fullName profilePic");

        res.status(200).json(user.friends);
    }catch(error){
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message:"Internal Server Error"});
    }
}


export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send a friend request to yourself." });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends." });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "A friend request already exists." });
    }

    
    const newRequest = new FriendRequest({
      sender: myId,
      recipient: recipientId,
    });

    await newRequest.save();

    res.status(201).json({ message: "Friend request sent successfully." });

  } catch (error) {
    console.error("Error in sendFriendRequest Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function acceptFriendRequest(req, res) {

    try{
        const {id:requestId} = req.params

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found"});
        }

        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({message: "you are not authorized to accept this request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });


        res.status(200).json({message: "Friend Request Accepted"});

        
    }catch(error){
        console.error("Error in acceptFriendRequest Controller :",error.message);
        res.status(500).json({message: "Internal Servver Error"});
    }
    
}

export async function getFriendRequests(req,res) {
    try{
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status:"pending",

        }).populate("sender","fullName profilePic bio");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",

        }).populate("recipient", "fullName profilePic");

        res.status(200).json({incomingReqs , acceptedReqs});
    }catch(error){
        console.error("Error in getPendingFriendRequest Controller :",error.message);
        res.status(500).json({message: "Internal Servver Error"});
    }
}

export async function getOutgoingFriendRequests(req,res) {

    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient","fullName profilePic bio");

        res.status(200).json(outgoingRequests);
    }catch(error){
        console.error("Error in getOutgoingFriendRequest Controller :",error.message);
        res.status(500).json({message: "Internal Servver Error"});
    }
    
}

export async function searchUsers(req, res) {
  try {
    const query = req.query.q;
    console.log("Search query:", query);
    const currentUserId = req.user.id;
    console.log("Current user ID:", currentUserId);

    if (!query || query.trim() === "") {
      return res.status(200).json([]);
    }

    const regex = new RegExp(query, "i");
    const matchedUsers = await User.find({
      _id: { $ne: currentUserId },
      $or: [{ fullName: regex }, { email: regex }],
    }).select("fullName email profilePic");

    console.log("Matched users:", matchedUsers);

    res.status(200).json(matchedUsers);
  } catch (error) {
    console.error("Error in searchUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}