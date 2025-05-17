import { generateStreamToken } from "../lib/stream.js";


export async function getStreamToken(req, res) {
    try{
        const token = generateStreamToken(req.user.id);

        res.status(200).json({ token });

    } catch(error) {
        console.error("Error in getStreamToken Controller :",error.message);
        res.status(500).json({message: "Internal Servver Error"});
    }
    
}