import { App } from 'antd';

let notification = null;
let message = null;
let modal = null;

export const AntdAppConfig = () => {
  const { 
    notification: staticNotification, 
    message: staticMessage, 
    modal: staticModal 
  } = App.useApp();

  notification = staticNotification;
  message = staticMessage;
  modal = staticModal;

  return null;
};

export const getNotification = () => notification;
export const getMessage = () => message;
export const getModal = () => modal;

export default {
  get notification() {
    return notification;
  },
  get message() {
    return message;
  },
  get modal() {
    return modal;
  },
};
