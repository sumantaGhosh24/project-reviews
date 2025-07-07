export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-background text-foreground rounded-md shadow-md dark:shadow-gray-400 h-[500px] w-[80%] flex items-center justify-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="text-lg">This is the home page.</p>
      </div>
    </div>
  );
}
