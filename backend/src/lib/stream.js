import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret) {
    console.error("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUser([userData]);
        return userData

    }catch(error){
        console.error("Error upserting stram user:", error);
    }
};

export const generateStreamToken = (userId) => {
    try{
        const userIdstr = userId.toString();
        return streamClient.createToken(userIdstr);
    }catch(error){
        console.error("Error generating stream token: ",error);
    }
};