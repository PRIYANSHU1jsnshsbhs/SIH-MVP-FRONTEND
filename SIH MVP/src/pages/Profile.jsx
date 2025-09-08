import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;
  if (error)
    return <div className="text-red-400 text-center mt-20">{error}</div>;
  if (!user) return null;

  const {
    personal_info,
    documents,
    addresses,
    emergency_contact,
    travel_details,
  } = user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 relative overflow-hidden p-6">
      {/* Background glows */}
      <div className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-white bg-gray-800/60 px-4 py-2 rounded-xl hover:bg-gray-700/70 transition mb-6 shadow-lg relative z-10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
      >
        {/* Left: Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center gap-6 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {personal_info?.first_name} {personal_info?.last_name}
              </h2>
              <p className="text-gray-400">{personal_info?.nationality}</p>
              <p className="text-sm text-gray-300">
                {personal_info?.contact?.email} • {personal_info?.contact?.phone_number}
              </p>
            </div>
          </div>

          {/* Info Sections */}
          <ProfileSection title="Personal Information">
            <ProfileItem label="Date of Birth" value={personal_info?.dob} />
            <ProfileItem label="Gender" value={personal_info?.gender} />
            <ProfileItem label="Nationality" value={personal_info?.nationality} />
          </ProfileSection>

          <ProfileSection title="Documents">
            <ProfileItem label="Passport Number" value={documents?.passport?.number} />
            <ProfileItem label="Passport Issue Date" value={documents?.passport?.issue_date} />
            <ProfileItem label="Passport Expiry Date" value={documents?.passport?.expiry_date} />
            <ProfileItem label="Issuing Country" value={documents?.passport?.issuing_country} />
            <ProfileItem label="Visa Type" value={documents?.visa?.type} />
            <ProfileItem label="Visa Expiry Date" value={documents?.visa?.expiry_date} />
          </ProfileSection>

          <ProfileSection title="Addresses">
            <ProfileItem label="Permanent" value={`${addresses?.permanent?.street}, ${addresses?.permanent?.city}, ${addresses?.permanent?.state}, ${addresses?.permanent?.postal_code}, ${addresses?.permanent?.country}`} />
            <ProfileItem label="In India" value={`${addresses?.in_india?.street}, ${addresses?.in_india?.city}, ${addresses?.in_india?.state}, ${addresses?.in_india?.postal_code}`} />
          </ProfileSection>

          <ProfileSection title="Emergency Contact">
            <ProfileItem label="Name" value={emergency_contact?.name} />
            <ProfileItem label="Relationship" value={emergency_contact?.relationship} />
            <ProfileItem label="Phone Number" value={emergency_contact?.phone_number} />
          </ProfileSection>

          <ProfileSection title="Travel Details">
            <ProfileItem label="Purpose of Visit" value={travel_details?.purpose_of_visit} />
            <ProfileItem label="Arrival Date" value={travel_details?.arrival_date} />
            <ProfileItem label="Departure Date" value={travel_details?.departure_date} />
          </ProfileSection>
        </div>

        {/* Right: QR Code Placeholder */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-top shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">My QR Code</h3>
          <div className="w-64 h-64 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
            {/* Replace this div with actual QR component */}
            QR Code Here
          </div>
          <p className="text-gray-400 text-sm mt-4 text-center">
            Scan to view complete profile
          </p>
        </div>
      </motion.div>
    </div>
  );
};

function ProfileSection({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-700/50 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">
        {value || <span className="text-gray-500">-</span>}
      </span>
    </div>
  );
}

export default Profile;
