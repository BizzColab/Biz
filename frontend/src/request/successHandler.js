import antdApp from '@/utils/antdApp';

import codeMessage from './codeMessage';

const successHandler = (response, options = { notifyOnSuccess: false, notifyOnFailed: true }) => {
  const { data } = response;
  if (data && data.success === true) {
    const message = response.data && data.message;
    const successText = message || codeMessage[response.status];

    if (options.notifyOnSuccess) {
      antdApp.notification?.success({
        title: `Request success`,
        description: successText,
        duration: 2,
      });
    }
  } else {
    const message = response.data && data.message;
    const errorText = message || codeMessage[response.status];
    const { status } = response;
    
    if (options.notifyOnFailed) {
      antdApp.notification?.error({
        title: `Request error ${status}`,
        description: errorText,
        duration: 4,
      });
    }
  }
};

export default successHandler;
