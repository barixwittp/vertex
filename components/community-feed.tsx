"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, MessageCircle, ThumbsUp } from "lucide-react"

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
  avatar?: string;
}

interface CommunityFeedProps {
  initialPosts?: Post[];
}

export function CommunityFeed({ initialPosts = [] }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPost, setNewPost] = useState("")

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now(),
        author: "Anonymous User",
        content: newPost,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: 0
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost(e.target.value)}
          />
          <div className="flex justify-between">
            <Button variant="outline" size="sm" type="button">
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
              {post.avatar && <AvatarImage src={post.avatar} alt={post.author} />}
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold">{post.author}</h4>
                <span className="text-sm text-muted-foreground">{post.timestamp}</span>
              </div>
              <p className="mt-2">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post attachment"
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

