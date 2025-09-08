import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const initialState = {
  personal_info: {
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    nationality: "",
    contact: {
      email: "",
      phone_number: "",
    },
  },
  documents: {
    passport: {
      number: "",
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
    permanent: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    in_india: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
    },
  },
  emergency_contact: {
    name: "",
    relationship: "",
    phone_number: "",
  },
  travel_details: {
    purpose_of_visit: "",
    arrival_date: "",
    departure_date: "",
  },
};

const CompleteYourProfile = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = localStorage.getItem("userId");

  const handleChange = (e, path) => {
    const value = e.target.value;
    setForm((prev) => {
      const updated = { ...prev };
      let ref = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("http://localhost:8080/api/auth/complete-profile", {
        userId,
        ...form,
      }, { withCredentials: true });
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3 border-b border-white/20 pb-1">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const Input = ({ label, type = "text", value, onChange }) => (
    <div>
      <label className="block text-gray-300 text-sm mb-1">{label}</label>
      <input
        type={type}
        className="w-full px-3 py-2 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        value={value}
        onChange={onChange}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 relative overflow-hidden">
      {/* Neon background orbs */}
      <div className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 relative"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Complete Your Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
        >
          {/* Personal Info */}
          <Section title="Personal Information">
            <Input
              label="First Name"
              value={form.personal_info.first_name}
              onChange={(e) => handleChange(e, ["personal_info", "first_name"])}
            />
            <Input
              label="Last Name"
              value={form.personal_info.last_name}
              onChange={(e) => handleChange(e, ["personal_info", "last_name"])}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.personal_info.dob}
              onChange={(e) => handleChange(e, ["personal_info", "dob"])}
            />
            <div>
              <label className="block text-gray-300 text-sm mb-1">Gender</label>
              <select
                className="w-full px-3 py-2 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={form.personal_info.gender}
                onChange={(e) => handleChange(e, ["personal_info", "gender"])}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <Input
              label="Nationality"
              value={form.personal_info.nationality}
              onChange={(e) =>
                handleChange(e, ["personal_info", "nationality"])
              }
            />
            <Input
              label="Email"
              type="email"
              value={form.personal_info.contact.email}
              onChange={(e) =>
                handleChange(e, ["personal_info", "contact", "email"])
              }
            />
            <Input
              label="Phone Number"
              type="tel"
              value={form.personal_info.contact.phone_number}
              onChange={(e) =>
                handleChange(e, ["personal_info", "contact", "phone_number"])
              }
            />
          </Section>

          {/* Documents */}
          <Section title="Documents">
            <Input
              label="Passport Number"
              value={form.documents.passport.number}
              onChange={(e) =>
                handleChange(e, ["documents", "passport", "number"])
              }
            />
            <Input
              label="Passport Issue Date"
              type="date"
              value={form.documents.passport.issue_date}
              onChange={(e) =>
                handleChange(e, ["documents", "passport", "issue_date"])
              }
            />
            <Input
              label="Passport Expiry Date"
              type="date"
              value={form.documents.passport.expiry_date}
              onChange={(e) =>
                handleChange(e, ["documents", "passport", "expiry_date"])
              }
            />
            <Input
              label="Issuing Country"
              value={form.documents.passport.issuing_country}
              onChange={(e) =>
                handleChange(e, ["documents", "passport", "issuing_country"])
              }
            />
            <Input
              label="Visa Type"
              value={form.documents.visa.type}
              onChange={(e) => handleChange(e, ["documents", "visa", "type"])}
            />
            <Input
              label="Visa Expiry Date"
              type="date"
              value={form.documents.visa.expiry_date}
              onChange={(e) =>
                handleChange(e, ["documents", "visa", "expiry_date"])
              }
            />
          </Section>

          {/* Addresses */}
          <Section title="Addresses">
            <Input
              label="Permanent Street"
              value={form.addresses.permanent.street}
              onChange={(e) =>
                handleChange(e, ["addresses", "permanent", "street"])
              }
            />
            <Input
              label="Permanent City"
              value={form.addresses.permanent.city}
              onChange={(e) =>
                handleChange(e, ["addresses", "permanent", "city"])
              }
            />
            <Input
              label="Permanent State"
              value={form.addresses.permanent.state}
              onChange={(e) =>
                handleChange(e, ["addresses", "permanent", "state"])
              }
            />
            <Input
              label="Postal Code"
              value={form.addresses.permanent.postal_code}
              onChange={(e) =>
                handleChange(e, ["addresses", "permanent", "postal_code"])
              }
            />
            <Input
              label="Country"
              value={form.addresses.permanent.country}
              onChange={(e) =>
                handleChange(e, ["addresses", "permanent", "country"])
              }
            />
            <Input
              label="India Street"
              value={form.addresses.in_india.street}
              onChange={(e) =>
                handleChange(e, ["addresses", "in_india", "street"])
              }
            />
            <Input
              label="India City"
              value={form.addresses.in_india.city}
              onChange={(e) =>
                handleChange(e, ["addresses", "in_india", "city"])
              }
            />
            <Input
              label="India State"
              value={form.addresses.in_india.state}
              onChange={(e) =>
                handleChange(e, ["addresses", "in_india", "state"])
              }
            />
            <Input
              label="India Postal Code"
              value={form.addresses.in_india.postal_code}
              onChange={(e) =>
                handleChange(e, ["addresses", "in_india", "postal_code"])
              }
            />
          </Section>

          {/* Emergency Contact */}
          <Section title="Emergency Contact">
            <Input
              label="Name"
              value={form.emergency_contact.name}
              onChange={(e) => handleChange(e, ["emergency_contact", "name"])}
            />
            <Input
              label="Relationship"
              value={form.emergency_contact.relationship}
              onChange={(e) =>
                handleChange(e, ["emergency_contact", "relationship"])
              }
            />
            <Input
              label="Phone Number"
              type="tel"
              value={form.emergency_contact.phone_number}
              onChange={(e) =>
                handleChange(e, ["emergency_contact", "phone_number"])
              }
            />
          </Section>

          {/* Travel Details */}
          <Section title="Travel Details">
            <Input
              label="Purpose of Visit"
              value={form.travel_details.purpose_of_visit}
              onChange={(e) =>
                handleChange(e, ["travel_details", "purpose_of_visit"])
              }
            />
            <Input
              label="Arrival Date"
              type="date"
              value={form.travel_details.arrival_date}
              onChange={(e) =>
                handleChange(e, ["travel_details", "arrival_date"])
              }
            />
            <Input
              label="Departure Date"
              type="date"
              value={form.travel_details.departure_date}
              onChange={(e) =>
                handleChange(e, ["travel_details", "departure_date"])
              }
            />
          </Section>

          {/* Error / Success */}
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-400 text-sm text-center">{success}</div>
          )}

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Profile"}
          </motion.button>
        </form>

       
      </motion.div>
       {/* DEV ONLY: Autofill sample data button */}
        {process.env.NODE_ENV !== "production" && (
          <button
            type="button"
            className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition-all duration-200"
            onClick={() =>
              setForm({
                personal_info: {
                  first_name: "John",
                  last_name: "Doe",
                  dob: "1990-05-15",
                  gender: "Male",
                  nationality: "US",
                  contact: {
                    email: "john.doe@example.com",
                    phone_number: "+1-555-123-4567",
                  },
                },
                documents: {
                  passport: {
                    number: "P1234567",
                    issue_date: "2020-01-20",
                    expiry_date: "2030-01-19",
                    issuing_country: "US",
                  },
                  visa: {
                    type: "Tourist",
                    expiry_date: "2026-03-30",
                  },
                },
                addresses: {
                  permanent: {
                    street: "123 Main St",
                    city: "Springfield",
                    state: "IL",
                    postal_code: "62701",
                    country: "US",
                  },
                  in_india: {
                    street: "45/A Karol Bagh",
                    city: "New Delhi",
                    state: "Delhi",
                    postal_code: "110005",
                  },
                },
                emergency_contact: {
                  name: "Jane Doe",
                  relationship: "Spouse",
                  phone_number: "+1-555-987-6543",
                },
                travel_details: {
                  purpose_of_visit: "Vacation",
                  arrival_date: "2025-09-08",
                  departure_date: "2025-09-22",
                },
              })
            }
          >
            Fill Sample Data
          </button>
        )}
    </div>
  );
};

export default CompleteYourProfile;
