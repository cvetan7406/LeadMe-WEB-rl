import { useState, useRef, useEffect } from "react";

// @mui material components
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import VuiButton from "../../components/VuiButton";

// Custom styles for the ChatAI
import ChatAIRoot from "./ChatAIRoot";

// Vision UI Dashboard React context
import {
  useVisionUIController,
  setOpenConfigurator,
} from "../../context";

function ChatAI() {
  const [controller, dispatch] = useVisionUIController();
  const { openConfigurator } = controller;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCloseChat = () => setOpenConfigurator(dispatch, false);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const authToken = import.meta.env.VITE_AUTO_DIALER_AUTH_TOKEN;
      
      // Using the full URL with /api/chat
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": authToken,
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.detail || "Failed to get response");
      }

      const data = await response.json();

      // Add AI response
      const aiMessage = {
        type: "ai",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      const errorMessage = {
        type: "ai",
        content: `Error: ${error.message || "Something went wrong. Please try again."}`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatAIRoot variant="permanent" ownerState={{ openConfigurator }}>
      <VuiBox
        backgroundColor="black"
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={3}
        pb={0.8}
        px={3}
      >
        <VuiBox>
          <VuiTypography color="white" variant="h5" fontWeight="bold">
            AI Chat Assistant
          </VuiTypography>
          <VuiTypography variant="body2" color="white" fontWeight="bold">
            Chat with our AI assistant
          </VuiTypography>
        </VuiBox>

        <CloseIcon
          sx={({ typography: { size, fontWeightBold }, palette: { white } }) => ({
            fontSize: `${size.md} !important`,
            fontWeight: `${fontWeightBold} !important`,
            stroke: `${white.main} !important`,
            strokeWidth: "2px",
            cursor: "pointer",
            mt: 2,
          })}
          onClick={handleCloseChat}
        />
      </VuiBox>

      <VuiBox
        sx={{
          height: "calc(100% - 200px)",
          overflowY: "auto",
          backgroundColor: "rgba(0,0,0,0.2)",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((message, index) => (
          <VuiBox
            key={index}
            sx={{
              alignSelf: message.type === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              backgroundColor: message.isError ? "error.main" : message.type === "user" ? "info.main" : "primary.main",
              borderRadius: "1rem",
              padding: "0.75rem 1rem",
              position: "relative",
            }}
          >
            <VuiTypography color="white" variant="button" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </VuiTypography>
            <VuiTypography
              variant="caption"
              color="white"
              sx={{ opacity: 0.7, display: "block", mt: 0.5 }}
            >
              {message.timestamp.toLocaleTimeString()}
            </VuiTypography>
          </VuiBox>
        ))}
        <div ref={messagesEndRef} />
      </VuiBox>

      <VuiBox
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1rem",
          backgroundColor: "black",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          multiline
          maxRows={3}
          disabled={isLoading}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "info.main",
              },
            },
            "& .MuiOutlinedInput-input": {
              "&::placeholder": {
                color: "rgba(255, 255, 255, 0.5)",
                opacity: 1,
              },
            },
          }}
        />
        <VuiButton
          color="info"
          variant="contained"
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
          sx={{
            minWidth: "auto",
            padding: "0.5rem",
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </VuiButton>
      </VuiBox>
    </ChatAIRoot>
  );
}

export default ChatAI;