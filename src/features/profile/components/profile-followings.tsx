import ProfileFollowingsTable from "./profile-followings-table";

interface ProfileFollowingsProps {
  id: string;
}

const ProfileFollowings = ({id}: ProfileFollowingsProps) => {
  return (
    <div>
      <div className="mb-8 text-left">
        <h1 className="mb-4 text-3xl font-bold">Followers</h1>
        <p className="text-gray-600">User followers</p>
      </div>
      <ProfileFollowingsTable id={id} />
    </div>
  );
};

export default ProfileFollowings;
