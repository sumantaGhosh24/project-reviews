import ProjectCard from "@/features/projects/components/project-card";

const ProfilePosts = () => {
  const PROJECT_DATA = [
    {
      id: 1,
      title: "EcoTrack: AI Personal Carbon Footprint",
      category: "SaaS / AI",
      description:
        "A mobile app that uses computer vision to scan grocery receipts and calculate the carbon footprint of your shopping cart automatically.",
      author: "Sarah Drasner",
      reviews: 24,
      upvotes: 142,
    },
    {
      id: 2,
      title: "DevQuest: Gamified Jira Alternative",
      category: "Productivity",
      description:
        "Turning software tickets into RPG quests. Complete a pull request, gain EXP, and level up your dev avatar with team-wide leaderboards.",
      author: "Marcus Aurelius",
      reviews: 8,
      upvotes: 89,
    },
    {
      id: 3,
      title: "OpenSauce: Local Restaurant API",
      category: "Open Source",
      description:
        "A unified API for independent restaurants that don't want to use UberEats. Completely open-source and community driven.",
      author: "Lee Robinson",
      reviews: 45,
      upvotes: 210,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PROJECT_DATA.map((p) => (
        <ProjectCard key={p.id} {...p} />
      ))}
    </div>
  );
};

export default ProfilePosts;
