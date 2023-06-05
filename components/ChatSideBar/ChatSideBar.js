import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ChatSideBar = ({ chatId }) => {
  const [chatList, setChatList] = useState([]);
    useEffect(() => {
      const loadChatList = async () => {
        const response = await fetch(`/api/chat/getChatList`, {
          method: "POST",
        });
        const json = await response.json();
        // console.log("Chat List", json);
        setChatList(json?.chats || []);
      };
      loadChatList();
    }, [chatId]);
    return (
      <div className="flex flex-col overflow-hidden bg-gray-900 text-white">
        <div className="bg-gray-800">
        <Link
          href="/chat"
          className="side-menu-item bg-emerald-500 hover:bg-emerald-600"
        >
          <FontAwesomeIcon icon={faPlus} />
          New chat
        </Link>
        </div>
        <div className="bg-grey-950 flex-1 overflow-auto sm:max-h-36">
          {chatList.map((chat) => (
            <Link
              key={chat._id}
              href={`/chat/${chat._id}`}
              className={`side-menu-item ${chatId === chat._id ? "bg-gray-700 hover:bg-gray-700" : ""}`}
            >
              <FontAwesomeIcon icon={faMessage} />
              <span title={chat.title} className="overflow-hidden text-ellipsis whitespace-nowrap">{chat.title}</span>
            </Link>
          ))}
        </div>
        <div className="bg-gray-700">
        <Link className="side-menu-item" href="/api/auth/logout">
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </Link>
        </div>
      </div>
    );
};