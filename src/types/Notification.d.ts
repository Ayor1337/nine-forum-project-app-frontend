interface SystemMessage {
  systemMessageId: number;
  title: string;
  content: string;
  createTime: Date;
}

interface MessageUnread {
  unread: number;
}
