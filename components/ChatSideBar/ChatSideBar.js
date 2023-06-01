import Link from "next/link";

export const ChatSideBar = () => {
    return <div className="bg-gray-900 text-white">
        <Link href="/api/auth/logout">Logout</Link>
    </div>;
};