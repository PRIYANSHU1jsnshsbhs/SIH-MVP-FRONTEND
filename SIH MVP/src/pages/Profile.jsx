import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { touristService } from "../services/touristService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nftData, setNftData] = useState(null);
  const [loadingNFT, setLoadingNFT] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      // Immediate UI fill: use last submitted profile if present
      try {
        const submitted = localStorage.getItem('submittedProfile');
        const digitalIdLS = localStorage.getItem('digitalId');
        if (submitted) {
          const p = JSON.parse(submitted);
          const immediateUser = {
            personal_info: {
              first_name: p?.personal_info?.first_name || '',
              last_name: p?.personal_info?.last_name || '',
              nationality: p?.personal_info?.nationality || '',
              dob: p?.personal_info?.dob || '',
              gender: p?.personal_info?.gender || '',
              contact: p?.contact || p?.personal_info?.contact
            },
            contact: p?.contact || p?.personal_info?.contact,
            documents: p?.documents || {},
            addresses: p?.addresses || {},
            emergency_contact: p?.emergency_contact || {},
            travel_details: p?.travel_details || {},
            digitalId: digitalIdLS
          };
          console.log('📱 Setting user from localStorage submittedProfile:', immediateUser);
          setUser(immediateUser);
          await loadNFTData();
          // Continue to refresh from backend or blockchain below
        }
      } catch (err) {
        console.warn('⚠️ Failed to load from localStorage:', err);
      }

      // Helper: map blockchain profile to UI shape expected by this component
      const mapBlockchainProfileToUser = (profile) => {
        if (!profile) return null;
        const nameParts = (profile.name || "").split(" ");
        const first_name = profile.first_name || nameParts[0] || "";
        const last_name = profile.last_name || nameParts.slice(1).join(" ") || "";
        return {
          personal_info: {
            first_name,
            last_name,
            nationality: profile.nationality || "",
            contact: undefined, // kept for compatibility below
          },
          // Provide a top-level contact like backend structure might do
          contact: {
            email: profile.email || "",
            phone_number: profile.phone || "",
          },
          documents: {
            passport: {
              number: profile.passportNumber || "",
              issue_date: "",
              expiry_date: "",
              issuing_country: "",
            },
            visa: {
              type: "",
              expiry_date: "",
            },
          },
          addresses: {
            permanent: {},
            in_india: {},
          },
          emergency_contact: {},
          travel_details: {},
        };
      };

      try {
        // Try traditional backend first
        if (token) {
          console.log('🌐 Fetching profile from backend with token:', token?.substring(0, 20) + '...');
          const res = await axios.get("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('📊 Backend response status:', res?.status);
          console.log('📊 Backend response data:', res?.data);
          if (res?.data?.user) {
            console.log('✅ Setting user from backend:', res.data.user);
            setUser(res.data.user);
            await loadNFTData();
            setLoading(false);
            return;
          } else {
            console.warn('⚠️ Backend response missing user data');
          }
        } else {
          console.warn('⚠️ No authentication token found');
        }
        throw new Error("Backend unavailable or no token");
      } catch (err) {
        console.warn("⚠️ Backend profile fetch failed, falling back to blockchain:", err?.message || err);

        // Blockchain fallback
        try {
          const touristId = localStorage.getItem("touristId");
          if (!touristId) throw new Error("No touristId in localStorage");

          const result = await touristService.getTouristProfile(touristId);
          const profile = result?.profile || result; // support both shapes
          const mapped = mapBlockchainProfileToUser(profile);

          if (!mapped) throw new Error("Empty profile from blockchain");
          setUser(mapped);
          await loadNFTData();
          setLoading(false);
          return;
        } catch (chainErr) {
          console.error("❌ Blockchain profile fallback failed:", chainErr?.message || chainErr);
          setError("Failed to load profile");
          setLoading(false);
        }
      }
    }
    fetchProfile();
  }, []);

  const loadNFTData = async () => {
    try {
      // Try to get NFT data from localStorage first
      const storedNFT = localStorage.getItem('touristNFT');
      const digitalId = localStorage.getItem('digitalId');
      const touristId = localStorage.getItem('touristId');

      if (storedNFT) {
        const parsedNFT = JSON.parse(storedNFT);
        console.log('📱 Loaded NFT data from localStorage:', parsedNFT);
        setNftData(parsedNFT);
      } else if (digitalId && touristId) {
        // If no stored NFT but we have IDs, try to recreate it
        console.log('🔄 No stored NFT found, attempting to recreate...');
        setLoadingNFT(true);
        
        // This would typically fetch from blockchain, but for now we'll create a placeholder
        const placeholderNFT = {
          qrCode: null,
          digitalId: digitalId,
          ipfsUrl: `https://ipfs.io/ipfs/placeholder_${digitalId}`,
          message: 'NFT data not available - please re-register to generate NFT'
        };
        
        setNftData(placeholderNFT);
        setLoadingNFT(false);
      }
    } catch (error) {
      console.error('❌ Failed to load NFT data:', error);
      setLoadingNFT(false);
    }
  };  const handleRegenerateNFT = async () => {
    if (!user) return;

    try {
      setLoadingNFT(true);
      console.log('🎨 Regenerating NFT for user...');

      // Create mock user data for NFT generation
      const userData = {
        name: `${user.personal_info?.first_name || ''} ${user.personal_info?.last_name || ''}`.trim(),
        email: user.contact?.email || user.email,
        phone: user.contact?.phone_number || user.phone,
        nationality: user.personal_info?.nationality || 'Indian',
        digitalId: localStorage.getItem('digitalId') || `regenerated_${Date.now()}`
      };

      const result = await touristService.registerTourist(userData);
      
      if (result.nft) {
        const nftData = {
          qrCode: result.nft.qrCodeUrl || result.nft.qrCode,
          digitalId: result.digitalId,
          ipfsUrl: result.nft.ipfsUrl,
          ipfsHash: result.nft.ipfsHash
        };

        setNftData(nftData);

        // Store NFT data
        localStorage.setItem('touristNFT', JSON.stringify(nftData));
        localStorage.setItem('digitalId', result.digitalId);
      }

    } catch (error) {
      console.error('❌ NFT regeneration failed:', error);
      alert('Failed to regenerate NFT. Please try again.');
    } finally {
      setLoadingNFT(false);
    }
  };

  // Removed duplicate profile fetch effect to avoid double requests and errors

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
                {(user?.contact?.email || personal_info?.contact?.email || '')}
                { (user?.contact?.phone_number || personal_info?.contact?.phone_number) ? ` • ${user?.contact?.phone_number || personal_info?.contact?.phone_number}` : ''}
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

        {/* Right: Digital Identity NFT QR Code */}
        <div className="space-y-6">
          {/* QR Code Display */}
          <QRCodeDisplay
            qrCodeUrl={nftData?.qrCode}
            digitalId={nftData?.digitalId || localStorage.getItem('digitalId')}
            ipfsUrl={nftData?.ipfsUrl}
            touristName={`${personal_info?.first_name || ''} ${personal_info?.last_name || ''}`.trim()}
          />

          {/* NFT Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">🎫 NFT Actions</h3>
            
            {loadingNFT ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">Processing NFT...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {!nftData?.qrCode && (
                  <button
                    onClick={handleRegenerateNFT}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
                  >
                    🎨 Generate NFT
                  </button>
                )}
                
                {nftData?.ipfsUrl && (
                  <a
                    href={nftData.ipfsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors block text-center"
                  >
                    🌐 View on IPFS
                  </a>
                )}

                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-2">Digital Identity Status:</p>
                  {(nftData?.ipfsHash || (nftData?.ipfsUrl && nftData?.qrCode)) ? (
                    <p className="text-green-400 text-sm">✅ NFT Created</p>
                  ) : (
                    <p className="text-yellow-400 text-sm">⏳ NFT Pending</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
            <h4 className="text-amber-200 font-semibold mb-2 flex items-center">
              🔒 Security Notice
            </h4>
            <p className="text-amber-100 text-sm">
              Your NFT contains verified identity data stored on blockchain. 
              This QR code proves your registration authenticity.
            </p>
          </div>
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
