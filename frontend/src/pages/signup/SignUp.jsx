import GenderCheckbox from "./GenderCheckbox";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import useSignup from "../../hooks/useSignup";
import toast from "react-hot-toast";

const SignUp = () => {
	const { loading, signup } = useSignup();
	const [formData, setFormData] = useState({
	  fullname: "",
	  username: "",
	  password: "",
	  confirmPassword: "",
	  gender: "",
	});

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

      // Username validation
      if (!username.includes("@")) {
        return "Username must contain '@'";
      }
      if (!/^[a-zA-Z0-9.]+$/.test(subdomain)) {
        return "Username can only contain letters, numbers, and periods";
      }
      if (subdomain.length < 6 || subdomain.length > 30) {
        return "Username must be between 6 and 30 characters";
      }
      if (subdomain.length >= 8 && !/[a-zA-Z]/.test(subdomain)) {
        return "Usernames with 8+ characters must include at least one letter";
      }
      if (!/[a-zA-Z0-9]$/.test(subdomain)) {
        return "The last character must be a letter or number";
      }
      if (/\.\./.test(subdomain)) {
        return "Username cannot contain consecutive periods";
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
		if(isEmailValid){
			// we will sent the confirmation code
		} else {
			toast.error("This email domain doesn't appear to support email. Please double-check for typos");
			return ;
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
	try{
		const res = await fetch(`/api/auth/validate-email`,{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({"email": formData.username})
		})
		const data = await res.json()
		return data?.isValid		
	} catch (error) {
		// toast.error(error)
	}
}

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500"> ChitChatHub</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">*Display Name</span>
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="John Doe"
              className="w-full input input-bordered  h-10 capitalize"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label p-2 ">
              <span className="text-base label-text">*Username</span>
            </label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              className={`w-full input input-bordered h-10 lowercase`}
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">*Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className={`w-full input input-bordered h-10`}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">*Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full input input-bordered h-10`}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <GenderCheckbox
            onCheckboxChange={handleCheckboxChange}
            selectedGender={formData.gender}
          />
          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
            href="#"
          >
            Already have an account?
          </Link>

          <div>
            <button
              className="btn btn-block btn-sm mt-2 border border-slate-700"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
