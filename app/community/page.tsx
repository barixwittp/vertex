"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, ThumbsUp, Share2, Flag, Upload } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Post {
  id: number;
  author: string;
  location: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Jane Doe",
      location: "New York, USA",
      content: "Air quality has improved significantly in my area after recent rain!",
      likes: 24,
      comments: 5,
      time: "2h ago",
    }
  ]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You", // In a real app, get from user auth
      location: "Your Location", // In a real app, get from geolocation
      content: content,
      image: image || undefined,
      likes: 0,
      comments: 0,
      time: "Just now"
    };

    setPosts([newPost, ...posts]);
    setContent("");
    setImage(null);

    toast({
      title: "Success",
      description: "Your post has been shared with the community!",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Community</h1>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="create">Create Post</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{post.author}</h3>
                        <p className="text-sm text-muted-foreground">
                          {post.location} • {post.time}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                    <p>{post.content}</p>
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="create">
            <Card className="p-4">
              <form onSubmit={handlePost} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Message</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts about air quality..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Image</label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {image && (
                    <div className="relative w-full h-48">
                      <Image
                        src={image}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImage(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={!content.trim()}>Post</Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

