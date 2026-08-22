import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    bio: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/users/profile");

        const user = response.data;

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          bio: user.bio || "",
          profileImage: null,
        });
      } catch (err) {
        console.error("Unable to load profile:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

     const data = new FormData();

data.append("name", formData.name);
data.append("phone", formData.phone);
data.append("address", formData.address);
data.append("city", formData.city);
data.append("bio", formData.bio);

if (formData.profileImage) {
  data.append("profileImage", formData.profileImage);
}

const response = await API.put(
  "/api/users/profile",
  data
);

      console.log(
        "Profile updated:",
        response.data
      );

      setSuccess(
        "Profile updated successfully."
      );

      // Update localStorage name as well
      const oldUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (oldUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...oldUser,
            name: response.data.user.name,
          })
        );
      }

      // Return to account after short delay
      setTimeout(() => {
        navigate("/account");
      }, 1000);

    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-container">
          <p className="account-loading">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">

      <div className="account-container">

        <div className="edit-profile-header">

          <p className="account-eyebrow">
            VENDORVERSE PROFILE
          </p>

          <h1>
            Edit Profile
          </h1>

          <p>
            Update your personal information.
          </p>

        </div>

        <section className="account-card">

          {error && (
            <div className="profile-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="profile-message success">
              {success}
            </div>
          )}

          <form
            className="edit-profile-form"
            onSubmit={handleSubmit}
          >

            {/* PROFILE IMAGE */}

<div className="edit-form-group">

  <label>
    Profile Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
  />

  <small>
    Select a profile image. Maximum size: 5MB.
  </small>

</div>

            {/* NAME */}

            <div className="edit-form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* PHONE */}

            <div className="edit-form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
              />

            </div>


            {/* CITY */}

            <div className="edit-form-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Karachi"
              />

            </div>


            {/* ADDRESS */}

            <div className="edit-form-group">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your complete address"
              />

            </div>


            {/* BIO */}

            <div className="edit-form-group">

              <label>
                Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell something about yourself..."
              />

            </div>


            {/* EMAIL */}

            <div className="edit-form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  JSON.parse(
                    localStorage.getItem("user")
                  )?.email || ""
                }
                disabled
              />

              <small>
                Email cannot be changed here.
              </small>

            </div>


            {/* BUTTONS */}

            <div className="edit-profile-actions">

              <button
                type="button"
                className="cancel-profile-button"
                onClick={() =>
                  navigate("/account")
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-profile-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </section>

      </div>

    </main>
  );
}

export default EditProfile;