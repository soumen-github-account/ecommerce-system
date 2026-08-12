import React from 'react'

import Input from '../../common/Input';
import Select from '../../common/Select';

export default function Step2Business({ next, prev, update, data }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    next();
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm text-gray-500 uppercase tracking-wide">Step 2: Business Info</h3>
      <h2 className="text-2xl font-bold mb-6">Business Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input 
            label="Business Name *" 
            value={data.businessName || ""} 
            onChange={(e) => update('business', { businessName: e.target.value })}  
          />
          <Select 
            label="Business Type *" 
            options={["Private Limited", "Partnership", "Proprietorship", "LLP"]}
            value={data.businessType || ""}
            onChange={(e) => update('business', { businessType: e.target.value })}
          />
          <Input 
            label="GSTIN Number" 
            value={data.gstin || ""} 
            onChange={(e) => update('business', { gstin: e.target.value })} 
          />
          <Input 
            label="PAN Number *" 
            value={data.pan || ""} 
            onChange={(e) => update('business', { pan: e.target.value })}  
          />
          <div className="col-span-2">
            <Input 
              label="Business Address *" 
              value={data.address || ""} 
              onChange={(e) => update('business', { address: e.target.value })} 
 
            />
          </div>
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
