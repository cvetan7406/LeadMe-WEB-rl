import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotifications();

  const handleClose = (id) => {
    removeNotification(id);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ position: 'relative', mt: 1 }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type || 'info'}
            sx={{
              width: '100%',
              backgroundColor: 
                notification.type === 'success' ? 'rgba(46, 125, 50, 0.9)' :
                notification.type === 'error' ? 'rgba(211, 47, 47, 0.9)' :
                notification.type === 'warning' ? 'rgba(237, 108, 2, 0.9)' :
                'rgba(2, 136, 209, 0.9)',
              color: 'white',
              '.MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {notification.title || notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default NotificationToast;