import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id?: string;
  placeholder?: string;
  error?: string;
  type?: string;
}

export function InputField({
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
        className={`${
          error ? "border-red-500 focus-visible:ring-red-500" : "border-none"
        }`}
      />
      {error && (
        <p className='text-red-500 lg:text-[16px] text-[13px] mt-1'>{error}</p>
      )}
    </>
  );
}
