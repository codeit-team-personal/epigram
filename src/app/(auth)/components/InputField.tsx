import { Input } from "@/components/ui/input";

interface FormFieldProps {
  className: string;
  id?: string;
  placeholder?: string;
  error?: string;
  type?: string;
}

export function InputField({
  className = "",
  id,
  placeholder,
  error,
  type = "text",
}: FormFieldProps) {
  return (
    <>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`${className} ${
          error ? "border-red-500 focus-visible:ring-red-500" : "border-none"
        }`}
      />
      {error && (
        <p className='text-red-500 lg:text-[16px] text-[13px] mt-1'>{error}</p>
      )}
    </>
  );
}
