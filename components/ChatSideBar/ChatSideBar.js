import Link from "next/link";
import { useEffect } from "react";

export const ChatSideBar = () => {
    useEffect(() => {
      const loadChatList = async () => {
        const response = await fetch(`/api/chat/getChatList`, {
          method: "POST",
        });
        const json = await response.json();
        console.log("Chat List", json);
      };
      loadChatList();
    });
    return <div className="bg-gray-900 text-white">
        <Link href="/api/auth/logout">Logout</Link>
    </div>;
};