"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, MessageCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const ChatSidebar = ({ rooms, currentChat, setCurrentChat }) => {
  const [notifications, setNotifications] = useState(null)
  const [ws, setWs] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const userInfo = useSelector((state) => state.auth.userInfo)
  const token = userInfo?.access

  useEffect(() => {
    if (!token) return
    const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/notifications/`)
    setWs(websocket)
    websocket.onopen = () => {
      console.log("WebSocket connected")
      websocket.send(JSON.stringify({ token }))
    }
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Notification received:", data)
      setNotifications(data)
      if (data?.lastmessages) {
          const updatedMessages = data.lastmessages.map((msg) => {
            const [roomId, roomData] = Object.entries(msg)[0]
            // Only send mark_as_read if this room is the current chat AND there are unread messages
            if (currentChat?.name === roomId ) {
              websocket.send(
                JSON.stringify({
                  token: token,
                  room_name: roomId,
                  type: "mark_as_read",
                }),
              )
              return { [roomId]: { ...roomData, unread: 0 } }
            }
            return msg
          })
        setNotifications((prev) => ({ ...prev, lastmessages: updatedMessages }))
      }
    }
    websocket.onclose = () => console.log("WebSocket disconnected")
    websocket.onerror = (error) => console.error("WebSocket error:", error)
    return () => {
      websocket.close()
    }
  }, [token, currentChat])

  const router = useRouter()
  const notificationMap = notifications?.lastmessages?.reduce((acc, obj) => {
    const [roomId, data] = Object.entries(obj)[0]
    acc[roomId] = data
    return acc
  }, {})

  const handleChatClick = (chat) => {
    setCurrentChat(chat)
    if (!ws || !token) return
    ws.send(
      JSON.stringify({
        token: token,
        room_name: chat.name,
        type: "mark_as_read",
      }),
    )
    setNotifications((prev) => {
      if (!prev) return prev
      const updatedMessages = prev.lastmessages.map((msg) => {
        if (msg[chat.name]) {
          return { [chat.name]: { ...msg[chat.name], unread: 0 } }
        }
        return msg
      })
      return { ...prev, lastmessages: updatedMessages }
    })
  }

  const filteredRooms = rooms?.data?.filter((chat) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      chat.profile.name.toLowerCase().includes(searchLower) ||
      chat.chat_user.toLowerCase().includes(searchLower) ||
      (notificationMap?.[chat.name]?.message?.toLowerCase().includes(searchLower) ?? false)
    )
  })

  return (
    <Card className="w-full h-full p-4 bg-gradient-to-b from-green-50/80 via-white to-green-50/40 shadow-none rounded-none md:rounded-xl border-0 md:border md:border-green-100/50 flex-shrink-0 flex flex-col backdrop-blur-sm">
      <div className="flex flex-col gap-4 mb-4 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-700" />
            </div>
            <span>Chats</span>
          </h2>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-semibold">
            {filteredRooms?.length || 0}
          </Badge>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400 transition-colors duration-200 group-focus-within:text-green-600" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70 border-green-300 focus:border-green-500 focus:ring-green-200 rounded-full transition-all duration-200 focus:bg-white"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-3">
          {filteredRooms?.length > 0 ? (
            filteredRooms.map((chat, idx) => {
              const roomNotif = notificationMap?.[chat.name]
              return (
                <div
                  key={chat.name}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-102 animate-in fade-in slide-in-from-left-2 ${
                    currentChat?.name === chat.name
                      ? "bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-600 shadow-md"
                      : "hover:bg-green-50/60 hover:border-l-4 hover:border-green-300"
                  }`}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <Avatar className="h-10 w-10 border-2 border-green-200 ring-2 ring-green-100 shadow-sm transition-transform duration-300 hover:scale-110">
                    <AvatarImage src={chat.profile.image || "/placeholder.svg"} className="object-cover" />
                    <AvatarFallback className="bg-green-200 text-green-800 font-semibold">
                      {chat.profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 overflow-hidden min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{chat.profile.name}</p>
                    <p
                      className={`text-xs truncate flex items-center gap-1 transition-colors duration-200 ${
                        roomNotif?.message ? "text-green-700 font-medium" : "text-gray-500"
                      }`}
                    >
                      {roomNotif?.message ? (
                        <>
                          <MessageCircle className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{roomNotif.message}</span>
                        </>
                      ) : (
                        "@" + chat.chat_user
                      )}
                    </p>
                  </div>
                  {roomNotif?.unread > 0 && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white ml-2 flex-shrink-0 shadow-md animate-pulse">
                      {roomNotif.unread}
                    </Badge>
                  )}
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 animate-in fade-in duration-300">
              <div className="p-3 bg-green-50 rounded-full mb-3">
                <Search className="h-6 w-6 text-green-300" />
              </div>
              <p className="text-sm font-medium">No chats found</p>
              {searchQuery && <p className="text-xs text-gray-500 mt-1">Try a different search term</p>}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default ChatSidebar
