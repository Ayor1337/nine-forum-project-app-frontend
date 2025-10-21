import service from "@/axios";
import { useAuth } from "@/components/AuthProvider";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Button } from "antd";
import { useEffect, useState } from "react";

export default function StatisticsWrapper() {
  const { currentUser } = useAuth();

  const [statData, setStatData] = useState<UserStat>();

  const fetchStatData = async () => {
    await service.get("/api/stat/info").then((res) => {
      if (res.data.code == 200) {
        setStatData(res.data.data);
      } else {
      }
    });
  };

  useEffect(() => {
    fetchStatData();
  }, []);

  return (
    statData && (
      <>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-500">发帖数</div>
                {/* TODO: 替换为真实统计 */}
                <div className="text-3xl font-semibold">
                  {statData.threadCount}
                </div>
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-500">回复数</div>
                {/* TODO: 替换为真实统计 */}
                <div className="text-3xl font-semibold">
                  {statData.postCount}
                </div>
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-500">被赞/被收藏</div>
                {/* TODO: 替换为真实统计 */}
                <div className="text-3xl font-semibold">
                  {statData.likedCount}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </>
    )
  );
}
