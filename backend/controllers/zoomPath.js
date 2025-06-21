import express from "express";
import fetch from "node-fetch";
import base64 from "base-64";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your Zoom App Credentials
const zoomAccountId = "YOUR_ZOOM_ACCOUNT_ID";
const zoomClientId = "YOUR_ZOOM_CLIENT_ID";
const zoomClientSecret = "YOUR_ZOOM_CLIENT_SECRET";

// Auth Headers for Zoom OAuth
const getAuthHeaders = () => ({
    Authorization: `Basic ${base64.encode(`${zoomClientId}:${zoomClientSecret}`)}`,
    "Content-Type": "application/json",
});

// Get Zoom Access Token
const generateZoomAccessToken = async () => {
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`;
    const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data.access_token;
};
// Password geneartion
const generateSecurePassword = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Create Zoom Meeting
const createZoomMeeting = async ({ topic, date, time, participants }) => {
    const accessToken = await generateZoomAccessToken();
    const startTime = new Date(`${date}T${time}:00`).toISOString();
    const securePassword = generateSecurePassword();
    const body = {
        topic,
        type: 2,
        start_time: startTime,
        duration: 60,
        timezone: "Asia/Kolkata",
        password: securePassword,
        settings: {
            host_video: false,
            participant_video: true,
            join_before_host: true, // ✅ allow users to join without host
            waiting_room: false,    // ✅ don't block users
            mute_upon_entry: true,
            approval_type: 1,       // ✅ automatic join
            auto_recording: "cloud", // ✅ save video in Zoom account
            meeting_authentication: false,
            meeting_invitees: participants.map(email => ({ email })),
        },
    };

    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    // ✅ Return public meeting link for participants
    return {
        meeting_id: data.id,
        topic: data.topic,
        start_time: data.start_time,
        join_url: data.join_url, // ✅ share this with both participants
        start_url: data.start_url, // ✅ for host, optional here
    };
};

// API Route

export const zoomService = async (req, res) => {
    try {
        const topic = 'ZOOM MEETING LINK';
        const { date, time, participants } = req.body;

        if (!topic || !date || !time || !Array.isArray(participants) || participants.length !== 2) {
            return res.status(400).json({ message: "Missing or invalid input" });
        }

        const { join_url, meeting_id, start_time } = await createZoomMeeting({
            topic,
            date,
            time,
            participants,
        });

        return res.status(202).json({ info: { join_url, meeting_id, start_time }, messsgae: 'Zoom meeting created successfully' });
    } catch (error) {
        console.error("❌ Meeting creation failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// {
//   "topic": "Final Advisor Call",
//   "date": "2025-06-20",
//   "time": "16:00",
//   "participants": ["email1@example.com", "email2@example.com"]
// }
