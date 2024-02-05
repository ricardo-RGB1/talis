import { Hint } from "@/components/form/hint"
import { HelpCircle, User2 } from "lucide-react"
import { FormPopover } from "@/components/form/form-popover"

export const BoardList = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="w-6 h-6 mr-2" />
                Your boards
            </div>
            {/* Render the boards inside a grid and define the #columns in each VP */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* FormPopover */}
               <FormPopover side='right' sideOffset={10} align='center'>
                <div 
                  role="button"
                  className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                >
                    <p className="text-sm">Create new board</p>
                    <span className="text-xs">5 remaining</span>
                    <Hint 
                        description={`Free workspaces can have up to 5 boards. Upgrade to a paid plan to create more.`}
                        sideOffset={40}>
                        <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
                    </Hint>
                </div>
                </FormPopover>
            </div>
        </div>
    )
}
