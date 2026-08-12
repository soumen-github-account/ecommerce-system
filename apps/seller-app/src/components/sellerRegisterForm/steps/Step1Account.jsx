import Input from "../../common/Input";


export default function Step1Account({ next, update, data }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    next();
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm text-gray-500 uppercase tracking-wide">Step 1: Account Creation</h3>
      <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name *" 
            value={data.fullName || ""} 
            onChange={(e) => update('account', { fullName: e.target.value })}  
          />
          <Input 
            label="Email Address *" 
            type="email"
            value={data.email || ""} 
            onChange={(e) => update('account', { email: e.target.value })}  
          />
          <Input 
            label="Phone Number *" 
            type="tel"
            value={data.phone || ""} 
            onChange={(e) => update('account', { phone: e.target.value })}  
          />
          <Input 
            label="Referral Code (Optional)" 
            value={data.referral || ""} 
            onChange={(e) => update('account', { referral: e.target.value })} 
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}