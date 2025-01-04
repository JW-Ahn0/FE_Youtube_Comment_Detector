"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Channel {
  channelId: string;
  channelTitle: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  playlistId: string;
}
export default function ChannelInfoPage() {
  const { channelId } = useParams();
  const [channelData, setChannelData] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChannelData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = process.env.NEXT_PUBLIC_TOKEN;
        const response = await fetch(`${apiUrl}/channel/${channelId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setChannelData(result.data as Channel);
        }
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannelData();
  }, [channelId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!channelData) {
    return <div>Error loading channel data.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">{channelData.channelTitle}</h1>
      <p>{channelData.description}</p>
      <div className="flex space-x-4">
        <div>
          <strong>Subscribers:</strong> {channelData.subscriberCount}
        </div>
        <div>
          <strong>Videos:</strong> {channelData.videoCount}
        </div>
        <div>
          <strong>Views:</strong> {channelData.viewCount}
        </div>
      </div>
    </div>
  );
}
