const steps = [
  "Basic Info",
  "Details",
  "Specification",
  "Variants",
  "Review",
];

export default function ProductStepper({
  currentStep,
}) {
  return (
    <div className="bg-white rounded-xl shadow mb-8 p-6">

      <div className="flex justify-between items-center">

        {steps.map((step, index) => {

          const active =
            currentStep === index + 1;

          const completed =
            currentStep > index + 1;

          return (
            <div
              key={index}
              className="flex-1 flex items-center"
            >
              <div className="flex flex-col items-center">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold

                  ${
                    completed
                      ? "bg-green-600 text-white"
                      : active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }
                  `}
                >
                  {completed ? "✓" : index + 1}
                </div>

                <span className="mt-2 text-sm font-medium">
                  {step}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1

                  ${
                    completed
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}