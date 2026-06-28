import FileUpload from "../../common/FileUpload";

export default function Step5KYC({ next, prev, update, data }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    next();
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm text-gray-500 uppercase tracking-wide">Step 5: KYC Verification</h3>
      <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-gray-600 text-sm">
          Please upload valid government-issued documents to verify your identity.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <FileUpload 
            label="Aadhar Card (Front & Back) *" 
            onChange={(file) => update('kyc', { aadhar: file })} 
          />
          <FileUpload 
            label="PAN Card *" 
            onChange={(file) => update('kyc', { pan: file })} 
          />
          <FileUpload 
            label="Business Registration Proof" 
            onChange={(file) => update('kyc', { businessProof: file })} 
          />
        </div>

        <div className="bg-blue-50 p-4 rounded text-sm text-blue-700">
          Note: Documents must be in JPG, PNG, or PDF format and less than 2MB.
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={prev} className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-50">
            Back
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}