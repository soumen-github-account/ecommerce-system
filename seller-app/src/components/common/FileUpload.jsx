export default function FileUpload({ label, onChange, required = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex items-center justify-center w-full">
        <input
          type="file"
          onChange={(e) => onChange(e.target.files[0])}
          required={required}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer border border-gray-300 rounded focus:outline-none"
        />
      </div>
      <p className="text-[10px] text-gray-400">Supported formats: JPG, PNG, PDF (Max 2MB)</p>
    </div>
  );
}