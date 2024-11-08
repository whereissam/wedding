import React, { useState, useEffect } from "react";

/**
 * MessageBoard component that displays messages from GitHub Issues
 * @returns {JSX.Element} MessageBoard component
 */
const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace these with your GitHub repository details
  const GITHUB_OWNER = "your-username";
  const GITHUB_REPO = "your-repo-name";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=open&labels=message`
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error("Received non-array data:", data);
          setError("Invalid data format received");
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Message Board</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{message.title}</h3>
              <p className="text-gray-600 mt-2">{message.body}</p>
              <div className="mt-2 text-sm text-gray-500">
                Posted by {message.user.login} on{" "}
                {new Date(message.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBoard;
