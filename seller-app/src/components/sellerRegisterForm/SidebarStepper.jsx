export default function SidebarStepper({ step }) {
  const steps = ["Account creation", "Business Info", "Store Setup", "Bank Details", "KYC verification", "Security setup", "Final success"];
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-8">
      <h2 className="font-bold text-gray-400 mb-6 text-sm uppercase">Sticky Progress</h2>
      <div className="flex flex-col gap-6">
        {steps.map((name, i) => (
          <div key={name} className={`flex items-center gap-3 ${step === i + 1 ? "text-blue-600 font-bold" : "text-gray-400"}`}>
            <div className={`w-4 h-4 rounded-full ${step > i + 1 ? "bg-green-500" : step === i + 1 ? "bg-blue-600" : "bg-gray-300"}`} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}