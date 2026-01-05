import {FilterIcon, PlusIcon, SearchIcon} from "lucide-react";

import ProjectCard from "@/features/projects/components/project-card";

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

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main>
        <section className="bg-slate-50 py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              Build better projects through{" "}
              <span className="text-indigo-600">honest feedback.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Post your project ideas, wireframes, or MVPs and get roasted
              (nicely) by a community of developers and designers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Submit Your Idea
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
                Browse Projects
              </button>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Controls: Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="relative w-full md:w-96">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search ideas (e.g. Fintech, AI, SaaS)..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                <FilterIcon className="w-4 h-4" /> Filter
              </button>
              <button className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
                <PlusIcon className="w-4 h-4" /> Post Idea
              </button>
            </div>
          </div>
          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECT_DATA.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
