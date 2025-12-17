import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styles from "../styles/ProfileModal.module.css";

const ProfileModal = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError) {
        console.error("Error when receiving a user:", authError.message);
        return;
      }

      const currentUser = authData.user;
      setUser(currentUser);

      // Отримання role і username з таблиці profiles
      const { data: profileData, error: profileError } = await supabase
        .from("Profiles")
        .select("role, username")
        .eq("user_id", currentUser.id)
        .single();

      if (profileError) {
        console.error("Error when receiving a profile:", profileError.message);
      } else {
        setRole(profileData.role);
        setUsername(profileData.username);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("user");
      onClose();
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      // Оновлення паролю через Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert("Error changing password: " + error.message);
      } else {
        alert("Password changed successfully.");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      alert("An error occurred while changing the password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {!isEditing ? (
          <>
            <div className={styles.header}>
              <div className={styles.avatar}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="User"
                />
              </div>
              <div>
                <div className={styles.username}>
                  {username || user?.email || "Guest"}
                </div>
                <div className={styles.role}>User group: {role || "User"}</div>
              </div>
            </div>

            <div className={styles.buttonGrid}>
              <button
                className={styles.actionButton}
                onClick={() => setIsEditing(true)}
              >
                ⚙️ Edit profile
              </button>
              <button className={styles.actionButton} onClick={handleLogout}>
                ↩️ Log out
              </button>
              {role === "admin" && (
                <button
                  data-testid="admin-panel-button-link"
                  type="button"
                  className={styles.actionButton}
                  onClick={() => {
                    onClose();
                    navigate("/admin/panel");
                  }}
                >
                  Admin panel
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles.editSection}>
              <h3>🔒 Change Password</h3>

              <input
                type="password"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={styles.inputField}
              />

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.inputField}
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
              />

              <div className={styles.buttonGrid}>
                <button
                  className={styles.actionButton}
                  onClick={handlePasswordChange}
                >
                  ✅ Confirm
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => setIsEditing(false)}
                >
                  🔙 Back
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
