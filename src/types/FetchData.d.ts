interface PageEntity<T> {
  totalSize: number;
  data: Array<T>;
}

interface Topic {
  topicId: number;
  title: string;
  coverUrl: string;
  description: string;
  viewCount: number;
  threadCount: number;
}

interface UserInfo {
  accountId: number;
  username: string;
  nickname: string;
  avatarUrl: string;
  bannerUrl: string;
  permission: UserPermission;
  bio?: string;
}

interface UserStat {
  accountStatId: number;
  threadCount: number;
  postCount: number;
  replyCount: number;
  likedCount: number;
  collectedCount: number;
  accountId: number;
}

interface UserPermission {
  accountId: number;
  roleName: string;
  roleNick: string;
  topicId: number;
  permissions: string[];
}

interface Theme {
  themeId: number;
  title: string;
}

interface Thread {
  threadId: number;
  title: string;
  imageUrls: Array<string>;
  content: string;
  createTime: Date;
  viewCount: number;
  postCount: number;
  likeCount: number;
  collectCount: number;
  accountId: number;
  topicId: number;
  accountName: string;
  avatarUrl: string;
  tag: Tag;
}

interface UserMessage {
  userInfo: UserInfo;
  message: ChatboardHistory;
}

interface ChatboardHistory {
  chatboardHistoryId: number;
  accountId: number;
  username: string;
  topicId: number;
  content: string;
  createTime: Date;
}

interface Announcement {
  threadId: number;
  topicId: number;
  title: string;
}

interface ThemeTopic {
  themeId: string;
  title: string;
  topics: Array<Topic>;
}

interface Post {
  postId: number;
  content: string;
  accountId: number;
  avatarUrl: string;
  nickname: string;
  createTime: Date;
  topicId: number;
  threadId: number;
}

interface Conversation {
  conversationId: number;
  userInfo: UserInfo;
  updateTime: Date;
}

interface ConversationMessage {
  conversationMessageId: number;
  content: string;
  accountId: number;
  avatarUrl: string;
  createTime: Date;
  updateTime: Date;
  isEdit: boolean;
}

interface ChatUnread {
  conversationId: number;
  fromUserId: number;
  unread: number;
}

interface Tag {
  tagId: number;
  tag: string;
}

interface Hotkeyword {
  keyword: string;
  count: number;
}
