import {requireSubscription} from "@/features/auth/helpers/auth-utils";
import CreateReleaseForm from "@/features/releases/components/create-release-form";

export const metadata = {
  title: "Create Release",
};

const CreateRelease = async ({
  params,
}: PageProps<"/project/details/[id]/release/create">) => {
  await requireSubscription();

  const {id} = await params;

  return (
    <div className="container mx-auto rounded-md shadow-md p-5 bg-background dark:shadow-white/40 my-20">
      <CreateReleaseForm projectId={id} />
    </div>
  );
};

export default CreateRelease;
