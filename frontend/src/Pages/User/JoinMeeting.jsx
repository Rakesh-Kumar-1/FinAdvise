import React, { useState, useEffect } from 'react';

// --- Styles (Moved from CSS file to prevent import errors) ---

const AppStyles = () => (
    <style>{`
        /* --- Global Styles & Variables --- */
        :root {
            --bg-primary: #111827; /* gray-900 */
            --bg-secondary: #1f2937; /* gray-800 */
            --bg-tertiary: #374151; /* gray-700 */
            --border-color: #4b5563; /* gray-600 */
            --text-primary: #ffffff;
            --text-secondary: #d1d5db; /* gray-300 */
            --text-tertiary: #9ca3af; /* gray-400 */
            --accent-blue: #2563eb; /* blue-600 */
            --accent-blue-hover: #1d4ed8; /* blue-700 */
            --accent-blue-light: #60a5fa; /* blue-400 */
            --font-family: 'Inter', sans-serif;
        }

        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            font-family: var(--font-family);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* --- App Container --- */
        .app-container {
            background-color: var(--bg-primary);
            width: 100%;
            height: 100vh;
            overflow: hidden;
            color: var(--text-primary);
        }

        /* --- Keyframes for Animation --- */
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .animate-spin {
            animation: spin 1s linear infinite;
        }

        /* --- Join Meeting Room Component --- */
        .join-room-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 1rem;
            text-align: center;
        }

        .join-room-title {
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .join-room-card {
            width: 100%;
            max-width: 32rem; /* max-w-lg */
            background-color: var(--bg-secondary);
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
        }

        .join-room-subtitle {
            font-size: 1.125rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .join-room-link-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background-color: var(--bg-tertiary);
            padding: 0.75rem;
            border-radius: 0.375rem;
            color: var(--accent-blue-light);
            margin-bottom: 1.5rem;
            word-break: break-all;
        }

        .join-room-link {
            font-family: monospace;
        }

        .join-room-status-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .back-button {
            margin-top: 2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            background: none;
            border: none;
            cursor: pointer;
            transition: color 0.2s;
        }

        .back-button:hover {
            color: var(--text-primary);
        }

        /* --- Home Page Component --- */
        .homepage-container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .header {
            width: 100%;
            padding: 1rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(75, 85, 99, 0.5);
            box-sizing: border-box;
        }

        .header-logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .header-logo-icon-wrapper {
            background-color: var(--accent-blue);
            padding: 0.5rem;
            border-radius: 0.5rem;
        }

        .header-logo-text {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.025em;
        }

        .header-date {
            color: var(--text-secondary);
        }

        .main-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .main-content-inner {
            width: 100%;
            max-width: 48rem; /* max-w-2xl */
            margin: 0 auto;
            text-align: center;
        }

        .main-title {
            font-size: 2.25rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1rem;
        }

        .main-subtitle {
            font-size: 1.125rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            max-width: 36rem; /* max-w-xl */
            margin-left: auto;
            margin-right: auto;
        }

        .input-section {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            align-items: center;
            max-width: 36rem;
            margin: 0 auto;
        }

        .join-input {
            width: 100%;
            padding: 1rem;
            border-radius: 0.5rem;
            background-color: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            text-align: center;
            box-sizing: border-box;
        }

        .join-input::placeholder {
            color: var(--text-tertiary);
        }

        .join-input:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--accent-blue);
        }

        .join-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            background-color: var(--accent-blue);
            color: var(--text-primary);
            font-weight: 700;
            padding: 1rem 2rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .join-button:hover {
            background-color: var(--accent-blue-hover);
            transform: scale(1.05);
        }

        .learn-more {
            margin-top: 2rem;
            color: var(--text-tertiary);
            cursor: pointer;
            transition: color 0.2s;
        }

        .learn-more:hover {
            color: var(--accent-blue-light);
        }

        /* --- Responsive Design --- */
        @media (min-width: 640px) { /* sm */
            .input-section {
                flex-direction: row;
            }
            .join-input {
                text-align: left;
            }
            .join-button {
                width: auto;
            }
        }

        @media (min-width: 768px) { /* md */
            .header-date {
                display: flex;
            }
            .main-title {
                font-size: 3rem; /* text-5xl */
            }
            .main-subtitle {
                font-size: 1.25rem; /* text-xl */
            }
        }

        @media (min-width: 1024px) { /* lg */
            .main-title {
                font-size: 3.75rem; /* text-6xl */
            }
        }
    `}</style>
);


// --- SVG Icons (replaces lucide-react) ---

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
);

const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
    </svg>
);

const LoaderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);


// --- Placeholder Component for Joining a Meeting ---

const JoinMeetingRoom = ({ onBack, link }) => {
    const [status, setStatus] = useState('Connecting...');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (link && (link.startsWith('http://') || link.startsWith('https://'))) {
                setStatus(`Successfully connected to the meeting!`);
            } else {
                setStatus('Connection Failed: Invalid meeting link.');
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [link]);

    return (
        <div className="join-room-container">
            <h1 className="join-room-title">Joining Meeting</h1>
            <div className="join-room-card">
                <p className="join-room-subtitle">Attempting to connect to:</p>
                <div className="join-room-link-wrapper">
                    <LinkIcon />
                    <span className="join-room-link">{link || 'No link provided'}</span>
                </div>
                <div className="join-room-status-wrapper">
                    {status.startsWith('Connecting') && <LoaderIcon />}
                    <p className="join-room-status">{status}</p>
                </div>
            </div>
            <button onClick={onBack} className="back-button">
                <ArrowLeftIcon />
                Back to Home
            </button>
        </div>
    );
};


// --- Main Home Component ---

const HomePage = ({ setPage, setLink }) => {
    const [inputValue, setInputValue] = useState('');

    const handleJoin = () => {
        if (inputValue.trim()) {
            setLink(inputValue.trim());
            setPage('join');
        }
    };

    return (
        <div className="homepage-container">
            <header className="header">
                <div className="header-logo">
                    <div className="header-logo-icon-wrapper">
                        <VideoIcon />
                    </div>
                    <span className="header-logo-text">MeetUP</span>
                </div>
                <div className="header-date">
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </header>

            <main className="main-content">
                <div className="main-content-inner">
                    <div className="text-content">
                        <h1 className="main-title">Join Your Meeting</h1>
                        <p className="main-subtitle">
                            Simply paste the meeting link below to get started. No accounts, no hassle.
                        </p>
                        <div className="input-section">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                                placeholder="Paste Zoom meeting link here"
                                className="join-input"
                            />
                            <button className="join-button" onClick={handleJoin}>
                                <LoginIcon />
                                Join
                            </button>
                        </div>
                         <p className="learn-more">Learn more about MeetUP</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- App Component (Main Entry Point) ---

export default function App() {
    const [page, setPage] = useState('home'); // 'home', 'join'
    const [link, setLink] = useState('');

    const renderPage = () => {
        switch (page) {
            case 'join':
                return <JoinMeetingRoom onBack={() => setPage('home')} link={link} />;
            case 'home':
            default:
                return <HomePage setPage={setPage} setLink={setLink} />;
        }
    };

    return (
        <div className="app-container">
            <AppStyles />
            {renderPage()}
        </div>
    );
}

