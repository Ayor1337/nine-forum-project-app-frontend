interface SystemMessage {
  systemMessageId: number;
  title: string;
  content: string;
  createTime: Date;
}

interface ReplyMessage {
  postId: number;
  content: string;
  createTime: Date;
  threadId: number;
  topicId: number;
  threadTitle: string;
  nickname: string;
}

interface VeifyMessage {
  token: string;
  isVerified: boolean;
}

interface MessageUnread {
  unread: number;
}
