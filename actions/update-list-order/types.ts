import { z } from 'zod';
import { List } from '@prisma/client';

import { ActionState } from "@/lib/create-safe-action";

import { UpdateListOrder } from './schema';

export type InputType = z.infer<typeof UpdateListOrder>; // The type of the input data
export type ReturnType = ActionState<InputType, List[]>; // The return type of the action

