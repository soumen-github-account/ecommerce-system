import { useState } from "react";
import axios from "axios";
import SidebarStepper from "../components/sellerRegisterForm/SidebarStepper";
import Step1Account from "../components/sellerRegisterForm/steps/Step1Account";
import Step2Business from "../components/sellerRegisterForm/steps/Step2Business";
import Step3Store from "../components/sellerRegisterForm/steps/Step3Store";
import Step4Bank from "../components/sellerRegisterForm/steps/Step4Bank";
import Step5KYC from "../components/sellerRegisterForm/steps/Step5KYC";
import Step6Security from "../components/sellerRegisterForm/steps/Step6Security";
import Step7Success from "../components/sellerRegisterForm/steps/Step7Success";

export default function SellerRegistration() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ account: {}, business: {}, store: {}, bank: {}, kyc: {}, security: {} });

  const next = () => setStep((s) => Math.min(s + 1, 7));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const updateForm = (section, data) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  const steps = {
    1: Step1Account, 2: Step2Business, 3: Step3Store, 
    4: Step4Bank, 5: Step5KYC, 6: Step6Security, 7: Step7Success
  };

  const CurrentStep = steps[step];

  const submitSeller = async () => {
    console.log(form.store);
    try {
      const formData = new FormData();

      // Account
      formData.append("fullName", form.account.fullName || "");
      formData.append("email", form.account.email || "");
      formData.append("phone", form.account.phone || "");
      formData.append("referral", form.account.referral || "");

      // Security
      formData.append("password", form.security.password || "");

      // Business
      formData.append("businessName", form.business.businessName || "");
      formData.append("businessType", form.business.businessType || "");
      formData.append("gstin", form.business.gstin || "");
      formData.append("pan", form.business.pan || "");
      formData.append("address", form.business.address || "");

      // // Store
      formData.append("storeName", form.store.storeName || "");
      formData.append("category", form.store.category || "");
      formData.append("description", form.store.description || "");
      formData.append("storeSlug", form.store.storeSlug || "");

      // Location
      formData.append("fullAddress", form.store.fullAddress || "");
      formData.append("placeId", form.store.placeId || "");
      formData.append("latitude", form.store.latitude || "");
      formData.append("longitude", form.store.longitude || "");
      formData.append("city", form.store.city || "");
      formData.append("state", form.store.state || "");
      formData.append("country", form.store.country || "");
      formData.append("pincode", form.store.pincode || "");

      // Bank
      formData.append("holderName", form.bank.holderName || "");
      formData.append("bankName", form.bank.bankName || "");
      formData.append("accountNumber", form.bank.accountNumber || "");
      formData.append("ifsc", form.bank.ifsc || "");
      formData.append("accountType", form.bank.typeSelect || "");

      // Files
      if (form.kyc.aadhar)
        formData.append("aadhar", form.kyc.aadhar);

      if (form.kyc.pan)
        formData.append("panCard", form.kyc.pan);

      if (form.kyc.businessProof)
        formData.append("businessProof", form.kyc.businessProof);

      const res = await axios.post(
        "http://localhost:5000/api/v1/sellers/seller/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );

      console.log(res.data);

      next();
    } catch (err) {
      console.log(err.response?.data);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarStepper step={step} />
      <div className="flex-1 p-10">
        <CurrentStep
          next={next}
          prev={prev}
          update={updateForm}
          data={
            step === 1
              ? form.account
              : step === 2
              ? form.business
              : step === 3
              ? form.store
              : step === 4
              ? form.bank
              : step === 5
              ? form.kyc
              : step === 6
              ? form.security
              : {}
          }
          submitSeller={submitSeller}
        />
      </div>
    </div>
  );
}