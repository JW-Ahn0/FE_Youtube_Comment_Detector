"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DummyChannels } from "@/constant/dummy";

interface Channel {
  channelId: string;
  channelTitle: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  publishedAt: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);

  const fetchChannels = async (query: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/search/channels?query=${query}`);
      const result = await response.json();
      if (result.success) {
        setChannels(result.data);
      } else {
        console.error("API returned an error");
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      setChannels(DummyChannels.data);
    }
  };

  const handleSearch = () => {
    if (searchTerm.length > 0) {
      console.log(searchTerm);
      fetchChannels(searchTerm);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-8">
      <div className="flex w-full max-w-[900px] items-center space-x-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요"
        />
        <Button type="button" onClick={handleSearch}>
          검색
        </Button>
      </div>
      <div className="w-full max-w-[900px]">
        {channels.map((channel) => (
          <div
            key={channel.channelId}
            className="flex mb-4 border-b border-gray-300 pb-4"
          >
            <img
              className="w-24 h-24 mr-4 rounded-full"
              src={channel.thumbnails.medium.url}
              alt={channel.channelTitle}
            />
            <div>
              <h3 className="text-lg font-bold">{channel.channelTitle}</h3>
              <p className="text-sm text-gray-600">{channel.description}</p>
              <p className="text-xs text-gray-500">
                Published at:{" "}
                {new Date(channel.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
