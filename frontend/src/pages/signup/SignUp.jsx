import GenderCheckbox from "./GenderCheckbox";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import toast from "react-hot-toast";

const SignUp = () => {
  const { loading, signup } = useSignup();
  // Add this to your component state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPolicyModal, setShowPolicyTermsModal] = useState(false);
  const [allfieldsFilled, setFieldsFilled] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
  };

  const handleCheckboxChange = (gender) => {
    setFormData({ ...formData, gender });
  };

  const getSubdomain = (username) => {
    username = username.toLowerCase();
    return username.split("@")[0];
  };

  const validate = () => {
    const { fullname, username, password, confirmPassword, gender } = formData;

    const subdomain = getSubdomain(username);

    // Helper function to return error messages for toast
    const getErrorMessage = () => {
      // Check for empty fields
      if (!fullname || !username || !password || !confirmPassword || !gender) {
        return "Please fill all fields";
      }

      // Full name validation
      if (!/^[a-zA-Z\s]+$/.test(fullname)) {
        return "Full name should only contain letters and spaces";
      }
      if (fullname.length < 3 || fullname.length > 30) {
        return "Full name must be between 3 and 30 characters";
      }

      // Email validation
      if (!username.includes("@")) {
        return "Email must contain '@'";
      }
      if (!/^[a-zA-Z0-9.]+$/.test(subdomain)) {
        return "Email can only contain letters, numbers, and periods";
      }
      if (subdomain.length < 6 || subdomain.length > 30) {
        return "Email must be between 6 and 30 characters";
      }
      if (subdomain.length >= 8 && !/[a-zA-Z]/.test(subdomain)) {
        return "Emails with 8+ characters must include at least one letter";
      }
      if (!/[a-zA-Z0-9]$/.test(subdomain)) {
        return "The last character must be a letter or number";
      }
      if (/\.\./.test(subdomain)) {
        return "Email cannot contain consecutive periods";
      }

      // Password validation
      if (password.length < 6) {
        return "Password must be at least 6 characters";
      }
      if (!/^\S+$/.test(password)) {
        return "Password cannot contain spaces";
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        return "Passwords do not match";
      }

      // Gender validation
      if (!gender) {
        return "Please select a gender";
      }

      return null; // No errors
    };

    const errorMessage = getErrorMessage();
    if (errorMessage) {
      toast.error(errorMessage); // Show the first encountered error as a toast
      return false;
    }

    return true; // All validations passed
  };

  const formatFullName = (name) => {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const isEmailValid = await emailVerification();
      if (isEmailValid) {
        // we will sent the confirmation code
      } else {
        toast.error(
          "This email domain doesn't appear to support email. Please double-check for typos"
        );
        return;
      }
      //   alert("Form submitted successfully!");

      // Sanitize and format form data
      const sanitizedFormData = {
        fullname: formatFullName(formData.fullname.trim()),
        username: formData.username.trim().toLowerCase(),
        password: formData.password.trim(),
        confirmPassword: formData.confirmPassword.trim(),
        gender: formData.gender,
      };

      // Uncomment the line below to handle form submission
      await signup(sanitizedFormData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const emailVerification = async () => {
    try {
      const res = await fetch(`/api/auth/validate-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.username }),
      });
      const data = await res.json();
      return data?.isValid;
    } catch (error) {
      // toast.error(error)
    }
  };

  const closeModel = () => {
    setShowTermsModal(false);
    setShowPolicyTermsModal(false);
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-md p-5 sm:p-6">
          {/* Chat Icon */}
          <motion.div
            className="flex justify-center"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.978 7.978 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.div>

          {/* Header */}
          <h1 className="text-lg font-semibold text-center text-gray-800 mb-1">
            Sign Up <span className="text-blue-500">ChitChatHub</span>
          </h1>
          <p className="text-center text-gray-500 text-xs mb-4">
            Create your account to join the chat.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3"
            autoComplete="off"
          >
            {/* Fullname */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Display Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="John Doe"
                className="input-sm"
                value={formData.fullname}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="username"
                name="username"
                type="email"
                placeholder="you@example.com"
                className="input-sm"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            {/* Password Row */}
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <div className="flex-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="input-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex-1 mt-3 sm:mt-0">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat"
                  className="input-sm"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Gender
              </label>
              <GenderCheckbox
                onCheckboxChange={handleCheckboxChange}
                selectedGender={formData.gender}
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="text-xs text-gray-600 mt-2 flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0 mr-2 text-white cursor-pointer h-5 bg-blue-500"
                required
              />
              <label htmlFor="terms" className="leading-snug">
                I agree to the&nbsp;
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-500 underline hover:text-blue-600"
                >
                  Terms and Conditions
                </button>{" "}
                &{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicyTermsModal(true)}
                  className="text-blue-500 underline hover:text-blue-600"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || !agreedToTerms}
              className={`w-full py-2 mt-2 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 transition flex items-center justify-center ${
                !agreedToTerms ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileTap={{ scale: 0.96 }}
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                "Create account"
              )}
            </motion.button>
            {/* Link */}
            <div className="text-right text-xs text-blue-500 flex justify-center">
              <Link to="/login" className="hover:underline">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
      <AnimatePresence>
        {(showTermsModal || showPolicyModal) && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white w-full max-w-md rounded-lg shadow-lg p-5 max-h-[80vh] overflow-y-auto relative text-xs font-medium text-gray-800"
            >
              {showTermsModal ? (
                <>
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    Terms & Conditions
                  </h2>
                  <p>
                    <strong>Last updated:</strong> June 22, 2025
                  </p>
                  <br />
                  <p>
                    Welcome to <strong>ChitChatHub</strong>! By signing up and
                    using this chat application, you agree to the following
                    terms and conditions. Please read them carefully.
                  </p>
                  <br />
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By creating an account and accessing the chat service, you
                    agree to comply with these Terms and all applicable laws.
                  </p>
                  <h3>2. User Conduct</h3>
                  <p>
                    You must use the app responsibly and respectfully. You agree
                    not to:
                  </p>
                  <ul>
                    <li>Harass, threaten, or abuse other users</li>
                    <li>Share illegal, harmful, or offensive content</li>
                    <li>Attempt to misuse or disrupt the app's services</li>
                  </ul>
                  <h3>3. Account Security</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account and password. Notify us immediately of any
                    unauthorized use.
                  </p>
                  <h3>4. Data Privacy and Security</h3>
                  <p>
                    We collect your name, email, password, and optional profile
                    details (gender, photo). Your email is encrypted and used
                    only for account-related features. Your messages are also
                    encrypted and unreadable to us.
                  </p>
                  <h3>5. Responsibility</h3>
                  <p>
                    You are responsible for your behavior and content. We are
                    not liable for misuse of the application and reserve the
                    right to take action against policy violations.
                  </p>
                  <h3>6. No Sponsorship</h3>
                  <p>
                    This application is independently developed and not
                    affiliated with or sponsored by any third party.
                  </p>
                  <h3>7. Limitation of Liability</h3>
                  <p>
                    This service is provided “as is.” We are not responsible for
                    any damages resulting from usage or service interruptions.
                  </p>
                  <h3>8. Changes to Terms</h3>
                  <p>
                    We may update these terms. Continued use means you accept
                    the latest version.
                  </p>
                  {/* <h3>9. Contact</h3>
              <p>
                If you have questions, contact us at{" "}
                <strong>[your contact email]</strong>.
              </p> */}
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    Privacy Policy
                  </h2>
                  <p>
                    <strong>Last updated:</strong> June 22, 2025
                  </p>
                  <br />
                  <p>
                    At <strong>ChitChatHub</strong>, we take your privacy
                    seriously. This policy explains what data we collect, how we
                    use it, and how we protect it.
                  </p>

                  <h3>1. Information We Collect</h3>
                  <ul>
                    <li>Name</li>
                    <li>Email (encrypted)</li>
                    <li>Password (encrypted)</li>
                    <li>Optional: Gender and profile photo</li>
                  </ul>

                  <h3>2. How We Use Your Data</h3>
                  <ul>
                    <li>
                      To provide chat functionality and account management
                    </li>
                    <li>For login security and password recovery</li>
                    <li>To respond to feedback and improve the service</li>
                  </ul>
                  <p>We do not sell your data or use it for advertising.</p>

                  <h3>3. Data Security</h3>
                  <p>
                    Your messages and personal data are encrypted using
                    industry-standard methods. We cannot view your chat content.
                  </p>

                  <h3>4. Messages Privacy</h3>
                  <p>
                    Messages are encrypted and only visible to sender and
                    recipient. We do not access or analyze message content.
                  </p>

                  <h3>5. User Responsibility</h3>
                  <p>
                    Misuse of the platform is your responsibility. Violations
                    may result in account suspension.
                  </p>

                  <h3>6. Data Retention</h3>
                  <p>
                    Your data is stored as long as your account is active. You
                    may request account deletion at any time.
                  </p>

                  <h3>7. Cookies and Tracking</h3>
                  <p>
                    We use minimal cookies necessary for functionality and
                    security. No tracking or profiling is performed.
                  </p>

                  <h3>8. Changes to This Policy</h3>
                  <p>
                    We may update this policy. Continued use of the app
                    constitutes your acceptance of any updates.
                  </p>
                </>
              )}

              <div className="mt-4 text-right">
                <button
                  onClick={() => closeModel()}
                  className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                >
                  I Understand
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => closeModel()}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default SignUp;
