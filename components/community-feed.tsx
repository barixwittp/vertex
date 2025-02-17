"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, MessageCircle, ThumbsUp } from "lucide-react"

export function CommunityFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Alex",
      avatar: "/placeholder.svg",
      content: "Heavy smog in downtown area today. Stay safe everyone! 😷",
      image: "/placeholder.svg",
      likes: 24,
      comments: 5,
      time: "2h ago",
    },
    {
      id: 2,
      user: "Sarah",
      avatar: "/placeholder.svg",
      content: "Beautiful clear skies after the rain! AQI is much better now. 🌤️",
      image: "/placeholder.svg",
      likes: 18,
      comments: 3,
      time: "4h ago",
    },
  ])

  const [newPost, setNewPost] = useState("")

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        user: "You",
        avatar: "/placeholder.svg",
        content: newPost,
        likes: 0,
        comments: 0,
        time: "Just now",
      }
      setPosts([post, ...posts])
      setNewPost("")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form onSubmit={handlePostSubmit} className="space-y-2">
          <Textarea
            placeholder="Share your local air quality update..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
            <Button type="submit" size="sm">
              Post Update
            </Button>
          </div>
        </form>
      </Card>

      {posts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={post.avatar} />
              <AvatarFallback>{post.user[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold">{post.user}</h4>
                <span className="text-sm text-muted-foreground">{post.time}</span>
              </div>
              <p className="mt-2">{post.content}</p>
              {post.image && (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post"
                  className="mt-2 rounded-lg w-full h-48 object-cover"
                />
              )}
              <div className="flex gap-4 mt-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {post.comments}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

