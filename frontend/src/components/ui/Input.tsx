import { Input as HeroInput, InputProps } from "@heroui/react";
import { forwardRef } from "react";

// Расширяем стандартные свойства Input
export interface CustomInputProps extends InputProps {
  label?: string;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, errorMessage, classNames, ...props }, ref) => {
    // Настраиваем стили для нашего input
    const customClassNames = {
      label: "absolute text-gray-500 -top-6 left-0",
      ...(classNames || {})
    };

    return (
      <div className="relative mt-6">
        <HeroInput 
          ref={ref}
          label={label} 
          errorMessage={errorMessage}
          classNames={customClassNames}
          {...props} 
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input; 