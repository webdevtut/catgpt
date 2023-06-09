import { ChatSideBar } from "components/ChatSideBar";
import { Message } from "components/Message";
import Head from "next/head";
import { useEffect, useState } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from 'uuid';
import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import clientPromise from "lib/mongodb";
import { faCat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default function ChatPage({chatId, title, messages = []}) {
  const [newChatId, setNewChatId] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [fullMessage, setFullMessage] = useState("");
  const router = useRouter();

  //Route changes set defaults
  useEffect(() => {
    setNewChatMessages([]);
    setNewChatId(null);
  }, [chatId])

// save newly streamed message to new chat messages
  useEffect(() => {
    if (!generatingResponse && fullMessage) {
      setNewChatMessages((prev) => [
        ...prev,
        {
          _id: uuid(),
          role: "assistant",
          content: fullMessage,
        },
      ]);
      setFullMessage("");
    }
  }, [generatingResponse, fullMessage]);

  //on creation of new chat
  useEffect(() => {
    if(!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, generatingResponse, router])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratingResponse(true);
    setNewChatMessages(prev => {
      const newChatMessages = [...prev, {
        _id: uuid(),
        role: "user",
        content: messageText
      }];
      return newChatMessages;
    })
    setMessageText("");
    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message: messageText,
      }),
    });
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    let content = "";
    await streamReader(reader, (message) => {
      if (message.event === "newChatId") {
        setNewChatId(message.content);
      } else {
        setIncomingMessage((s) => `${s}${message.content}`);
        content = content + message.content;
      }
    });
    setFullMessage(content);
    setIncomingMessage("");
    setGeneratingResponse(false);
  };
  const allMessages = [...messages, ...newChatMessages];
  return (
    <>
      <Head>
        <title>CatGPT | New Chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr] sm:grid-cols-[1fr]">
        <ChatSideBar chatId={chatId} />
        <div className="flex flex-col overflow-hidden bg-gray-700">
          {allMessages.length == 0 && (
            <div className="my-3 flex min-h-[20%] flex-col items-center justify-center text-3xl">
              <FontAwesomeIcon icon={faCat} className="text-emerald-200" />
              <h6 className="my-2 text-white">Start asking questions to AI</h6>
            </div>
          )}
          <div className="flex-1 overflow-scroll text-white">
            {allMessages.map((message) => (
              <Message
                key={message._id}
                role={message.role}
                content={message.content}
              />
            ))}
            {!!incomingMessage && (
              <Message role="assistant" content={incomingMessage} />
            )}
          </div>
          <footer className="bg-gray-800 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Send a message..."}
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
                />
                <button type="submit" className="btn">
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const chatId = ctx.params?.chatId?.[0] || null;
  if(chatId) {
    const {user} = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("catGPT");
    const chat = await db.collection("chats").findOne({
      userId: user.sub,
      _id: new ObjectId(chatId)
    })
    return {
      props: {
        chatId,
        title: chat.title,
        messages: chat.messages.map((message) => ({
          ...message,
          _id: uuid(),
        })),
      },
    };
  }
  return {
    props: {}
  }
}
