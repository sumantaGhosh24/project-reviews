import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Post = {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
};

const ProfilePosts = () => {
  const posts: Post[] = Array.from({length: 9}).map((_, i) => ({
    id: `p${i + 1}`,
    imageUrl: "",
    likes: 10 + i * 3,
    comments: 2 + (i % 4),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <Card key={p.id} className="p-0">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <span>❤️ {p.likes}</span>
            <span>💬 {p.comments}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProfilePosts;
