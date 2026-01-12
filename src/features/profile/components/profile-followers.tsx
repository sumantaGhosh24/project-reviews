import ProfileFollowersTable from "./profile-followers-table";

interface ProfileFollowersProps {
  id: string;
}

const ProfileFollowers = ({id}: ProfileFollowersProps) => {
  return (
    <div>
      <div className="mb-8 text-left">
        <h1 className="mb-4 text-3xl font-bold">Followers</h1>
        <p className="text-gray-600">User followers</p>
      </div>
      <ProfileFollowersTable id={id} />
    </div>
  );
};

export default ProfileFollowers;
