import service from "@/axios";
import { getImageUrl } from "@/axios/ImageService";
import { Card, Avatar, Divider } from "antd";
import { useEffect, useState } from "react";

interface defineProps {
  userId: string;
}

export default function UserContentRightbar({ userId }: defineProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const fetchUserInfo = async () => {
    await service
      .get(`/api/user/info/by_user_id`, {
        params: {
          user_id: userId,
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setUserInfo(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    userInfo && (
      <div className="flex flex-col flex-1/4">
        <Card className="rounded-2xl shadow-sm flex">
          <div className="flex items-center gap-3">
            <Avatar size={48} src={getImageUrl(userInfo?.avatarUrl)} />
            <div>
              <div className="font-medium">{userInfo?.nickname}</div>
              {userInfo.permission && (
                <div className="text-red-500">
                  {userInfo?.permission.roleNick}
                </div>
              )}
            </div>
          </div>
          <Divider className="my-3" />
        </Card>
      </div>
    )
  );
}
