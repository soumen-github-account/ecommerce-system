const steps = [
  {
    id: 1,
    title: "Basic Info",
    description: "Category, Brand & Seller",
  },
  {
    id: 2,
    title: "Product Details",
    description: "Description & Services",
  },
  {
    id: 3,
    title: "Variants",
    description: "Variant Management",
  },
  {
    id: 4,
    title: "Specifications",
    description: "Price, Stock & Images",
  },
  {
    id: 5,
    title: "SEO",
    description: "Search Optimization",
  },
  {
    id: 6,
    title: "Review",
    description: "Verify & Publish",
  },
];

export default function ProductStepper({
  currentStep,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">

      <div className="flex items-start">

        {steps.map((step, index) => {

          const active = currentStep === step.id;

          const completed =
            currentStep > step.id;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-start"
            >

              {/* Circle + Text */}
              <div className="flex flex-col items-center w-36">

                <div
                  className={`
                    w-12
                    h-12
                    rounded-full
                    flex
                    items-center
                    justify-center
                    font-bold
                    transition-all

                    ${
                      completed
                        ? "bg-green-600 text-white"
                        : active
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-gray-200 text-gray-600"
                    }
                  `}
                >
                  {completed ? "✓" : step.id}
                </div>

                <p
                  className={`
                    mt-3
                    font-semibold
                    text-center

                    ${
                      active
                        ? "text-blue-600"
                        : completed
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step.title}
                </p>

                <p className="text-xs text-gray-400 text-center mt-1">
                  {step.description}
                </p>

              </div>

              {/* Line */}
              {index !== steps.length - 1 && (
                <div className="flex-1 mt-5">

                  <div
                    className={`
                      h-1
                      rounded-full
                      transition-all

                      ${
                        completed
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }
                    `}
                  />

                </div>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}