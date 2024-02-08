"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultImages } from "@/constants/images";
import { FormErrors } from "./form-errors";



/**
 * The props for the form picker component.
 */
interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

/**
 * A form picker component.
 *
 * @param id - The id of the form picker.
 * @param errors - The errors for the form picker.
 */
export const FormPicker = ({ id, errors }: FormPickerProps) => {
  // Get the form status
  const { pending } = useFormStatus();

  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState(null);



  // Fetch images from Unsplash
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          count: 9,
          collectionIds: ["317099"],
        });

        if (result && result.response) {
          // Check if the response exists
          const unsplashImages = result.response as Array<Record<string, any>>; // Type cast the response to an array of objects
          setImages(unsplashImages); // Set the images state to the array of objects
        } else {
          console.error("No response from Unsplash");
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages); // Set the images state to the default images
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages(); // Call the fetchImages function
  }, []);


// If the images are still loading, show a loading spinner
  if (isLoading) { 
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id); // Show the selected image to the user.
            }}
          >
            <input 
                type='radio'
                // When submitting the form, the selected image id will be sent to the server.
                id={id} 
                name={id}
                className="hidden"
                disabled={pending}
                checked={selectedImageId === image.id}
                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`} // The value of the selected image will be the id, thumb, full, and the creator of the image and be sent to the server.
            />
            <Image
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover rounded-sm"
              fill
            />
            {/* Add a checkmark  */}
             {selectedImageId === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30
              flex items-center justify-center">
                <Check className="h-4 w-4 text-white bg-black rounded-full" />
              </div>
            )}
            {/* Per Unsplash Api, provide a link to the creator of the image */}
            <Link
              href={image.links.html} // Link to the image on Unsplash
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
                {/* The name of the creator of the image */}
              {image.user.name} 
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id='image' errors={errors}  />
    </div>
  );
};
