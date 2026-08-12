export default function Step7Success() {
  return (
    <div className="max-w-xl mx-auto bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        {/* Aap yahan checkmark icon use kar sakte hain */}
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for submitting your details. Our team is currently reviewing your documents. 
        You will receive an update on your registered email within 24–48 hours.
      </p>

      <div className="border-t pt-6">
        <button 
          onClick={() => window.location.href = '/'} 
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}