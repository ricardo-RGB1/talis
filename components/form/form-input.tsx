'use client'; 


import {  forwardRef } from 'react';
import { useFormStatus } from "react-dom"; 
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from "@/lib/utils";
import { FormErrors } from './form-errors';


interface FormInputProps {
    id: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string; 
    defaultValue?: string;
    onBlur?: () => void;
}; 


export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    id,
    label,
    type,
    placeholder,
    required,
    disabled,
    errors,
    className,
    defaultValue = "",
    onBlur
}, ref) => {
     const { pending } = useFormStatus(); // for form status

     return (
        <div className='space-y-2'>
            <div className='space-y-1'>
                {label ? (
                    <Label 
                        htmlFor={id}
                        className='text-sm font-semibold text-neutral-700'
                    >
                        {label}
                    </Label>
                ) : null}
                <Input 
                    onBlur={onBlur}
                    defaultValue={defaultValue}
                    ref={ref}
                    required={required}
                    name={id}
                    id={id}
                    placeholder={placeholder}
                    type={type} 
                    disabled={pending || disabled}
                    className={cn("text-sm px-2 py-2 h-7", className)}
                    aria-describedby={`${id}-error`} // for aria error message 
                />
            </div>  
            <FormErrors 
                id={id}
                errors={errors}
             />
        </div>
     )
})

FormInput.displayName = "FormInput"; 