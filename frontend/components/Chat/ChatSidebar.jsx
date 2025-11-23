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

    const websocket = new WebSocket( `ws://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/notifications/`)
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
          if (currentChat?.name === roomId) {
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

  // Filter rooms based on search query
  const filteredRooms = rooms?.data?.filter(chat => {
    const searchLower = searchQuery.toLowerCase()
    return (
      chat.profile.name.toLowerCase().includes(searchLower) ||
      chat.chat_user.toLowerCase().includes(searchLower) ||
      (notificationMap?.[chat.name]?.message?.toLowerCase().includes(searchLower) ?? false)
    )
  })

  return (
    <Card className="w-full md:w-80 h-full md:h-[calc(100vh-8rem)] p-4 bg-gradient-to-b from-green-50 to-white shadow-lg rounded-lg border-green-100 flex-shrink-0">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Chats</span>
          </h2>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {filteredRooms?.length || 0}
          </Badge>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-green-200 focus:border-green-400"
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-7rem)]">
        <div className="space-y-2 pr-2">
          {filteredRooms?.length > 0 ? (
            filteredRooms.map((chat) => {
              const roomNotif = notificationMap?.[chat.name]
              return (
                <div
                  key={chat.name}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    currentChat?.name === chat.name
                      ? "bg-green-200 shadow-md border-l-4 border-green-500"
                      : "hover:bg-green-100 hover:border-l-4 hover:border-green-300"
                  }`}
                >
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={chat.profile.image || "/placeholder.svg"} className="object-cover" />
                    <AvatarFallback className="bg-green-200 text-green-800">{chat.profile.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <p className="font-semibold text-gray-800 truncate">{chat.profile.name}</p>
                    <p
                      className={`${
                        roomNotif?.message ? "text-zinc-600 font-medium" : "text-gray-500"
                      } text-xs truncate flex items-center gap-1`}
                    >
                      {roomNotif?.message ? (
                        <>
                          <MessageCircle className="h-3 w-3" /> {roomNotif.message}
                        </>
                      ) : (
                        "@" + chat.chat_user
                      )}
                    </p>
                  </div>
                  {roomNotif?.unread > 0 && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white ml-1">{roomNotif.unread}</Badge>
                  )}
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
              <Search className="h-8 w-8 mb-2" />
              <p>No chats found</p>
              {searchQuery && <p className="text-sm">Try a different search term</p>}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default ChatSidebar