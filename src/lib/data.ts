import { Category, CategoryVersion, Project, Review, User } from "./types";

function avgRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

const users: User[] = [
  { id: "u1", name: "Alice Johnson", avatarUrl: "/avatars/1.png", bio: "Frontend Engineer" },
  { id: "u2", name: "Bob Smith", avatarUrl: "/avatars/2.png", bio: "Backend Specialist" },
  { id: "u3", name: "Carol Lee", avatarUrl: "/avatars/3.png", bio: "Fullstack Developer" },
];

const sampleReviews: Review[] = [
  { id: "r1", user: users[0], rating: 5, text: "Excellent project with clean architecture.", date: "2024-08-12" },
  { id: "r2", user: users[1], rating: 4, text: "Great documentation. Minor issues with setup.", date: "2024-09-05" },
  { id: "r3", user: users[2], rating: 3, text: "Good ideas but needs more tests.", date: "2024-10-21" },
];

const categoryVersions: CategoryVersion[] = [
  { id: "cv1", date: "2024-05-01", changes: "Initial creation" },
  { id: "cv2", date: "2024-08-12", changes: "Updated description and color" },
];

export const categories: Category[] = [
  { id: "c1", name: "SaaS", description: "Software as a Service projects", color: "#1e90ff", icon: "cloud", versions: categoryVersions },
  { id: "c2", name: "E-commerce", description: "Online store and commerce", color: "#ff6347", icon: "cart", versions: [{ id: "cv3", date: "2024-07-11", changes: "Icon update" }] },
  { id: "c3", name: "Content", description: "CMS and content platforms", color: "#32cd32", icon: "document" },
  { id: "c4", name: "AI", description: "Artificial Intelligence tools", color: "#8a2be2", icon: "sparkles" },
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Next.js Analytics Dashboard",
    description: "A modern analytics dashboard with charts and real-time updates.",
    thumbnail: "/images/projects/analytics-thumb.jpg",
    images: ["/images/projects/analytics-1.jpg", "/images/projects/analytics-2.jpg", "/images/projects/analytics-3.jpg"],
    tags: ["Next.js", "Charts", "SaaS"],
    categoryId: "c1",
    status: "active",
    timeline: "2024 Q1–Q3",
    team: [users[0], users[2]],
    author: users[0],
    reviews: sampleReviews,
    averageRating: avgRating(sampleReviews),
  },
  {
    id: "p2",
    title: "E-commerce Starter",
    description: "Starter template for online stores with cart and checkout flows.",
    thumbnail: "/images/projects/ecommerce-thumb.jpg",
    images: ["/images/projects/ecommerce-1.jpg", "/images/projects/ecommerce-2.jpg"],
    tags: ["Commerce", "Stripe", "Tailwind"],
    categoryId: "c2",
    status: "completed",
    timeline: "2024 Q2",
    team: [users[1], users[0]],
    author: users[1],
    reviews: [
      { id: "r4", user: users[0], rating: 4, text: "Solid foundation for small shops.", date: "2024-07-11" },
      { id: "r5", user: users[2], rating: 5, text: "Loved the components and UX.", date: "2024-12-03" },
    ],
    averageRating: avgRating([
      { id: "r4", user: users[0], rating: 4, text: "Solid foundation for small shops.", date: "2024-07-11" },
      { id: "r5", user: users[2], rating: 5, text: "Loved the components and UX.", date: "2024-12-03" },
    ]),
  },
  {
    id: "p3",
    title: "Content CMS",
    description: "Headless CMS with rich text editor and media library.",
    thumbnail: "/images/projects/cms-thumb.jpg",
    images: ["/images/projects/cms-1.jpg"],
    tags: ["CMS", "Editor", "Headless"],
    categoryId: "c3",
    status: "draft",
    timeline: "2024 Q4",
    team: [users[2]],
    author: users[2],
    reviews: [],
    averageRating: 0,
  },
  {
    id: "p4",
    title: "Project Review Hub",
    description: "A platform to discover and review open-source projects.",
    thumbnail: "/images/projects/review-thumb.jpg",
    images: ["/images/projects/review-1.jpg", "/images/projects/review-2.jpg"],
    tags: ["Reviews", "Community", "Open Source"],
    categoryId: "c1",
    status: "active",
    timeline: "2024–2025",
    team: [users[1], users[2]],
    author: users[1],
    reviews: [
      { id: "r6", user: users[1], rating: 2, text: "Needs performance optimizations.", date: "2024-03-15" },
    ],
    averageRating: avgRating([{ id: "r6", user: users[1], rating: 2, text: "Needs performance optimizations.", date: "2024-03-15" }]),
  },
  {
    id: "p5",
    title: "AI Assistant",
    description: "Chat-based assistant with tool integrations.",
    thumbnail: "/images/projects/ai-thumb.jpg",
    images: ["/images/projects/ai-1.jpg", "/images/projects/ai-2.jpg", "/images/projects/ai-3.jpg"],
    tags: ["AI", "Chat", "Tools"],
    categoryId: "c4",
    status: "active",
    timeline: "2025 Q1",
    team: [users[0], users[1], users[2]],
    author: users[0],
    reviews: [
      { id: "r7", user: users[2], rating: 5, text: "Impressive features and UX.", date: "2024-11-23" },
      { id: "r8", user: users[1], rating: 4, text: "Great potential. Roadmap looks good.", date: "2025-01-02" },
    ],
    averageRating: avgRating([
      { id: "r7", user: users[2], rating: 5, text: "Impressive features and UX.", date: "2024-11-23" },
      { id: "r8", user: users[1], rating: 4, text: "Great potential. Roadmap looks good.", date: "2025-01-02" },
    ]),
  },
  {
    id: "p6",
    title: "Portfolio Template",
    description: "Clean portfolio template for developers and designers.",
    thumbnail: "/images/projects/portfolio-thumb.jpg",
    images: ["/images/projects/portfolio-1.jpg"],
    tags: ["Portfolio", "Design", "Tailwind"],
    categoryId: "c3",
    status: "completed",
    timeline: "2024 Q3",
    team: [users[2]],
    author: users[2],
    reviews: [],
    averageRating: 0,
  },
];
