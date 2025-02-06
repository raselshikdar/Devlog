import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Ensure this is your Firestore instance
import { useAuth } from "../lib/authContext"; // Custom auth hook if available

export default function UserProfile({ user }) {
  const { authUser } = useAuth(); // Ensure the user is logged in
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || "");
  const [website, setWebsite] = useState(user.website || "");
  const [socialLinks, setSocialLinks] = useState(user.socialLinks || {});

  const handleUpdate = async () => {
    if (authUser?.uid === user.uid) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { bio, website, socialLinks });
      setEditing(false);
    }
  };

  return (
    <div className="profile">
      <h2>{user.fullName} (@{user.username})</h2>
      {editing ? (
        <>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Add a bio" />
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" />
          <input type="text" value={socialLinks.twitter || ""} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="Twitter" />
          <input type="text" value={socialLinks.github || ""} onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })} placeholder="GitHub" />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>{bio || "No bio added"}</p>
          <p><a href={website} target="_blank" rel="noopener noreferrer">{website || "No website added"}</a></p>
          <p>Twitter: {socialLinks.twitter || "Not added"}</p>
          <p>GitHub: {socialLinks.github || "Not added"}</p>
          {authUser?.uid === user.uid && <button onClick={() => setEditing(true)}>Edit Profile</button>}
        </>
      )}
    </div>
  );
}
