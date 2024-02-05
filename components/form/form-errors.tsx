import { XCircle } from 'lucide-react'; 

interface FormErrorsProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
};

export const FormErrors = ({
    id,
    errors
}: FormErrorsProps) => {

    // If there are no errors, return null
    if(!errors) {
        return null;
    }
    
    // If there are errors, return the errors
    return (
        <div
          id={`${id}-error`}
          aria-live="polite"
          className='mt-2 text-xs text-rose-500'
        >
        {errors?.[id]?.map((error:string) => ( // Map through the errors and display them
            <div 
                key={error}
                className='flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm'
                >
                <XCircle className='w-4 h-4 mr-2' />
                {error}
            </div>
        ))}

        </div>
    )

}