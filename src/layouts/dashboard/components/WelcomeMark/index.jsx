import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Icon } from "@mui/material";
import VuiBox from "../../../../components/VuiBox";
import VuiTypography from "../../../../components/VuiTypography";
import { useAuth } from "../../../../context/AuthContext";
import { supabase } from "../../../../config/supabaseClient";
import gif from "../../../../assets/images/cardimgfree.png";

const WelcomeMark = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const handleStartRecording = () => {
    navigate('/create/campaign');
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserName = async () => {
      try {
        // If user is null/undefined (logged out) or missing ID, don't make the API call
        if (!user || !user.id) {
          if (isMounted) setUserName('Guest');
          return;
        }

        console.log('User object:', user);
        
        // First, try to get the display name from user metadata if available
        if (user.user_metadata?.display_name) {
          if (isMounted) setUserName(user.user_metadata.display_name);
          return;
        }
        
        // As a fallback, try to get it from the database
        try {
          const { data, error } = await supabase
            .from('users')
            .select('display_name')
            .eq('id', user.id)
            .single();
          
          // Only update state if component is still mounted
          if (!isMounted) return;

          if (error) {
            console.error('Error fetching user name:', error);
            // Fallback to email if there's an error
            setUserName(user.email?.split('@')[0] || 'User');
            return;
          }

          if (data?.display_name) {
            setUserName(data.display_name);
          } else {
            // Fallback to email if no display name
            setUserName(user.email?.split('@')[0] || 'User');
          }
        } catch (dbError) {
          console.error('Error in database query:', dbError);
          if (isMounted) {
            // Fallback to email in case of any database error
            setUserName(user.email?.split('@')[0] || 'User');
          }
        }
      } catch (error) {
        console.error('Error in fetchUserName:', error);
        // Only update state if component is still mounted
        if (isMounted) {
          // Fallback to email in case of any error
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    };

    fetchUserName();
    
    // Cleanup function to prevent updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Don't render welcome content if no user
  if (!user) {
    return null;
  }

  return (
    <Card sx={() => ({
      height: "340px",
      py: "32px",
      backgroundImage: `url(${gif})`,
      backgroundSize: "cover",
      backgroundPosition: "50%"
    })}>
      <VuiBox
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // semi-transparent black
          zIndex: 1,
        }}
      />
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between" sx={{ position: "relative", zIndex: 2 }}>
        <VuiBox>
          <VuiTypography color="text" variant="button" fontWeight="regular" mb="12px">
            Welcome back,
          </VuiTypography>
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="18px">
            {userName}
          </VuiTypography>
          <VuiTypography color="text" variant="h6" fontWeight="regular" mb="auto">
            Glad to see you again!
            <br /> Ask me anything.
          </VuiTypography>
        </VuiBox>
        <VuiTypography
          component="button"
          variant="button"
          color="white"
          fontWeight="regular"
          onClick={handleStartRecording}
          sx={{
            background: 'none',
            border: 'none',
            padding: 0,
            mr: "5px",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",

            "& .material-icons-round": {
              fontSize: "1.125rem",
              transform: `translate(2px, -0.5px)`,
              transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
            },

            "&:hover .material-icons-round, &:focus  .material-icons-round": {
              transform: `translate(6px, -0.5px)`,
            },
          }}
        >
          Tap to record
          <Icon sx={{ fontWeight: "bold", ml: "5px" }}>arrow_forward</Icon>
        </VuiTypography>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;
