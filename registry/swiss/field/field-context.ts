// Swiss — Field ↔ control context (React skin, Layer 3). Shared by Field +
// Input/Textarea/Select. Field wraps its control through `children`, so it can't
// touch the child to set aria attributes or push its size down. Instead it
// PROVIDES this context; the wrapped control reads it and wires its OWN
// `aria-invalid` + `aria-describedby` and inherits the field size. A control
// rendered on its own (no Field) reads `null` and falls back to its defaults.
import { createContext, useContext } from 'react';

export type FieldSize = 'sm' | 'md' | 'lg';

export type FieldContextValue = {
	invalid: boolean;
	describedById?: string;
	size?: FieldSize;
};

export const FieldContext = createContext<FieldContextValue | null>(null);
export const useFieldContext = () => useContext(FieldContext);
