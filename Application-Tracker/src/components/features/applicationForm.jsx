import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { submitApplication } from "../../api/applications";

export default function ApplicationForm({ job, onBack, onSubmitSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Email is invalid";
    if (phone && !/^(\+\d{1,3})?(\d{3})?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone))
      newErrors.phone = "Invalid phone number";
    if (!resume) newErrors.resume = "Resume is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const applicationData = {
        name,
        email,
        phone,
        coverLetter,
        position: job.title,
        company: job.company,
      };

      await submitApplication(applicationData, resume);

      setIsSuccess(true);

      setTimeout(() => {
        onSubmitSuccess();
      }, 2000);
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResume(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2 text-blue-800">
          Application Submitted!
        </h3>
        <p className="text-gray-600">
          Thank you for applying to {job.title} at {job.company}. We'll contact
          you soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 mr-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
        </button>
        <h3 className="text-xl font-bold text-blue-800">
          Apply for {job.title}
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-blue-800 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 bg-white border ${
                errors.name ? "border-red-500" : "border-blue-200"
              } rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-800 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-blue-200"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-blue-800 mb-1"
            >
              Phone Number{" "}
              <span className="text-blue-600 text-sm">(Optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
              placeholder="(123) 456-7890"
            />
          </div>

          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-blue-800 mb-1"
            >
              Resume/CV
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-blue-200"
              } ${errors.resume ? "border-red-500" : ""}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {resume ? (
                <div className="flex items-center justify-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-800">
                    {resume.name}
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => setResume(null)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 mb-1 text-center">
                    Drag and drop your resume here, or
                  </p>
                  <button
                    type="button"
                    className="block mx-auto px-3 py-1 border border-blue-200 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-50"
                    onClick={() =>
                      document.getElementById("resume-upload")?.click()
                    }
                  >
                    Browse Files
                  </button>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
            {errors.resume && (
              <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
            )}
            <p className="text-xs text-blue-600 mt-1">
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          <div>
            <label
              htmlFor="cover-letter"
              className="block text-sm font-medium text-blue-800 mb-1"
            >
              Cover Letter{" "}
              <span className="text-blue-600 text-sm">(Optional)</span>
            </label>
            <textarea
              id="cover-letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're a good fit for this position..."
              className="w-full px-3 py-2 border border-blue-200 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
            By submitting this application, you agree to our privacy policy and
            terms of service.
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
