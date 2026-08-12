
import { Lock } from 'lucide-react'; // Agar lucide-react install hai
import Input from '../../common/Input';
import Select from '../../common/Select';

export default function Step4Bank({ next, prev, update, data }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    next();
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm text-gray-500 uppercase tracking-wide">Step 4: Bank Account Details</h3>
      <h2 className="text-2xl font-bold mb-6">Bank Account Details</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Account Holder Name *" 
            value={data.holderName || ""} 
            onChange={(e) => update('bank', { holderName: e.target.value })}  
          />
          <Input 
            label="Bank Name" 
            value={data.bankName || ""} 
            onChange={(e) => update('bank', { bankName: e.target.value })} 
          />
          <Input 
            label="Account Number *" 
            value={data.accountNumber || ""} 
            onChange={(e) => update('bank', { accountNumber: e.target.value })}  
          />
          <Input 
            label="IFSC Code" 
            value={data.ifsc || ""} 
            onChange={(e) => update('bank', { ifsc: e.target.value })} 
          />
          <Input 
            label="Account Type" 
            value={data.accountType || ""} 
            onChange={(e) => update('bank', { accountType: e.target.value })} 
          />
          <Select 
            label="Account Type *" 
            options={["Savings", "Current"]}
            value={data.typeSelect || ""}
            onChange={(e) => update('bank', { typeSelect: e.target.value })}
          />
        </div>

        {/* Security Info Box */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded border border-gray-200">
          <Lock className="text-gray-400 w-8 h-8 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">Your bank details are encrypted and secure.</p>
            <p className="text-xs text-green-600 font-semibold">Fintech-grade Security</p>
          </div>
        </div>

        <p className="text-sm text-gray-600">Bank verification usually takes 24–48 hours</p>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={prev} className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-50">
            Back
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Verify & Continue
          </button>
        </div>
      </form>
    </div>
  );
}