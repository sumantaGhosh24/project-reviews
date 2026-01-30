import Link from "next/link";

import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import {Button} from "@/components/ui/button";

export const metadata = {
  title: "Home",
};

const Home = async () => {
  await requireUnauth();

  return (
    <section className="py-20 px-6 container mx-auto h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-foreground tracking-tight">
          Build better projects through{" "}
          <span className="text-primary">honest feedback.</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
          Post your project ideas, wireframes, or MVPs and get roasted (nicely)
          by a community of developers and designers.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="xl">
            <Link href="/login">Submit Your Idea</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/login">Browse Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Home;
