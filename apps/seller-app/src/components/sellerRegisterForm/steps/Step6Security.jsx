import Input from "../../common/Input";


export default function Step6Security({ next, prev, update, data, submitSeller }) {
  const handleSubmit = async(e) => {
    e.preventDefault();
    // Yahan aap validation add kar sakte hain (e.g., password match check)
    await submitSeller();
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm text-gray-500 uppercase tracking-wide">Step 6: Security Setup</h3>
      <h2 className="text-2xl font-bold mb-6">Secure Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Create Password *" 
            type="password"
            value={data.password || ""} 
            onChange={(e) => update('security', { password: e.target.value })}   
          />
          <Input 
            label="Confirm Password *" 
            type="password"
            value={data.confirmPassword || ""} 
            onChange={(e) => update('security', { confirmPassword: e.target.value })}  
          />
        </div>

        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800 font-medium">Password Requirements:</p>
          <ul className="text-xs text-yellow-700 list-disc ml-4 mt-2">
            <li>Minimum 8 characters long</li>
            <li>Must include at least one number and one special character</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={prev} className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-50">
            Back
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Finish & Submit
          </button>
        </div>
      </form>
    </div>
  );
}