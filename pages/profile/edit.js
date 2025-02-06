// pages/profile/edit.js
import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfile() {
  const [userData, setUserData] = useState({
    bio: "",
    website: "",
    socialMedia: {
      twitter: "",
      github: "",
      linkedin: "",
    },
  });

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData({
          bio: data.bio || "",
          website: data.website || "",
          socialMedia: data.socialMedia || {
            twitter: "",
            github: "",
            linkedin: "",
          },
        });
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, userData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
        <label>Bio:</label>
        <textarea
          value={userData.bio}
          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
        />

        <label>Website:</label>
        <input
          type="url"
          value={userData.website}
          onChange={(e) =>
            setUserData({ ...userData, website: e.target.value })
          }
        />

        <label>Twitter:</label>
        <input
          type="url"
          value={userData.socialMedia.twitter}
          onChange={(e) =>
            setUserData({
              ...userData,
              socialMedia: {
                ...userData.socialMedia,
                twitter: e.target.value,
              },
            })
          }
        />

        <label>GitHub:</label>
        <input
          type="url"
          value={userData.socialMedia.github}
          onChange={(e) =>
            setUserData({
              ...userData,
              socialMedia: {
                ...userData.socialMedia,
                github: e.target.value,
              },
            })
          }
        />

        <label>LinkedIn:</label>
        <input
          type="url"
          value={userData.socialMedia.linkedin}
          onChange={(e) =>
            setUserData({
              ...userData,
              socialMedia: {
                ...userData.socialMedia,
                linkedin: e.target.value,
              },
            })
          }
        />

        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
