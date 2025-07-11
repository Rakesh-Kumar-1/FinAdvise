import { chatbot } from "../controllers/chatbot.js";

export const chat = async (req, res) => {
    try {
        const { message } = req.body;

        const lowerMsg = message.toLowerCase();

        const matched = chatbot.find(item =>
            item.keywords.some(keyword => lowerMsg.includes(keyword))
        );

        if (matched) {
            return res.status(200).json({ status: true, answer: matched.answer });
        } else {
            return res.status(200).json({ status: true, answer: "Sorry, I didn't understand. Could you rephrase?" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, answer: error });
    }
};
