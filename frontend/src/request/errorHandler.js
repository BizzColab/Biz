import antdApp from '@/utils/antdApp';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  console.error("DEBUG ERROR HANDLER:", error);
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
  if (!isOnline) {
    if (antdApp.notification) {
      antdApp.notification.error({
        title: 'No internet connection',
        description: 'Cannot connect to the Internet, Check your internet network',
        duration: 15,
      });
    }
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Check your internet network',
    };
  }

  const { response } = error;

  if (!response) {
    if (antdApp.notification) {
      antdApp.notification.error({
        title: 'Problem connecting to server',
        description: 'Cannot connect to the server, Try again later',
        duration: 20,
      });
    }
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Contact your Account administrator',
    };
  }

  if (response && response.data && response.data.jwtExpired) {
    if (typeof window !== 'undefined') {
      const result = window.localStorage.getItem('auth');
      const jsonFile = window.localStorage.getItem('isLogout');
      const { isLogout } = (jsonFile && JSON.parse(jsonFile)) || false;
      window.localStorage.removeItem('auth');
      window.localStorage.removeItem('isLogout');
      if (result || isLogout) {
        window.location.href = '/logout';
      }
    }
  }

  if (response && response.status) {
    const message = response.data && response.data.message;

    const errorText = message || codeMessage[response.status];
    const { status } = response;
    
    if (antdApp.notification) {
      if (status === 403 && errorText.includes('Email not verified')) {
        antdApp.notification.warning({
          message: 'Verification Required',
          description: errorText,
          duration: 10,
        });
      } else {
        antdApp.notification.error({
          title: `Request error ${status}`,
          description: errorText,
          duration: 20,
        });
      }
    }

    if (status === 401 || response?.data?.error?.name === 'JsonWebTokenError') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth');
        window.localStorage.removeItem('isLogout');
        window.location.href = '/logout';
      }
    } else return response.data;
  } else {
    if (antdApp.notification) {
      if (isOnline) {
        antdApp.notification.error({
          title: 'Problem connecting to server',
          description: 'Cannot connect to the server, Try again later',
          duration: 15,
        });
      } else {
        antdApp.notification.error({
          title: 'No internet connection',
          description: 'Cannot connect to the Internet, Check your internet network',
          duration: 15,
        });
      }
    }

    if (isOnline) {
      return {
        success: false,
        result: null,
        message: 'Cannot connect to the server, Contact your Account administrator',
      };
    } else {
      return {
        success: false,
        result: null,
        message: 'Cannot connect to the server, Check your internet network',
      };
    }
  }
};

export default errorHandler;
