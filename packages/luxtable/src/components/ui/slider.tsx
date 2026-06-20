"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    value?: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value = [0, 100], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
        const [localValue, setLocalValue] = React.useState<number[]>(value);

        React.useEffect(() => {
            setLocalValue(value);
        }, [value]);

        const handleChange = (index: number, newValue: number) => {
            const newValues = [...localValue];
            newValues[index] = Math.max(min, Math.min(max, newValue));
            
            
            if (newValues.length === 2) {
                if (index === 0 && newValues[0] > newValues[1]) {
                    newValues[0] = newValues[1];
                } else if (index === 1 && newValues[1] < newValues[0]) {
                    newValues[1] = newValues[0];
                }
            }
            
            setLocalValue(newValues);
            onValueChange?.(newValues);
        };

        const percentage = (val: number) => ((val - min) / (max - min)) * 100;

        return (
            <div className={cn("relative flex w-full items-center", className)}>
                {localValue.length === 2 ? (
                    
                    <div className="relative w-full">
                        <input
                            ref={ref}
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={localValue[0]}
                            onChange={(e) => handleChange(0, Number(e.target.value))}
                            className="absolute h-2 w-full appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--lux-focus-ring))] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[hsl(var(--lux-filter-background))] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[hsl(var(--lux-focus-ring))] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[hsl(var(--lux-filter-background))] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
                            style={{ zIndex: localValue[0] > localValue[1] ? 20 : 10 }}
                            {...props}
                        />
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={localValue[1]}
                            onChange={(e) => handleChange(1, Number(e.target.value))}
                            className="absolute h-2 w-full appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--lux-focus-ring))] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[hsl(var(--lux-filter-background))] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[hsl(var(--lux-focus-ring))] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[hsl(var(--lux-filter-background))] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
                            style={{ zIndex: localValue[1] > localValue[0] ? 20 : 10 }}
                        />
                        <div className="absolute h-2 w-full rounded-full bg-[hsl(var(--lux-filter-border))]" />
                        <div
                            className="absolute h-2 rounded-full bg-[hsl(var(--lux-focus-ring))]"
                            style={{
                                left: `${percentage(Math.min(localValue[0], localValue[1]))}%`,
                                width: `${percentage(Math.max(localValue[0], localValue[1])) - percentage(Math.min(localValue[0], localValue[1]))}%`,
                            }}
                        />
                    </div>
                ) : (
                    
                    <div className="relative w-full">
                        <input
                            ref={ref as React.RefObject<HTMLInputElement>}
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={localValue[0]}
                            onChange={(e) => handleChange(0, Number(e.target.value))}
                            className="h-2 w-full appearance-none rounded-full bg-[hsl(var(--lux-filter-border))] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(var(--lux-focus-ring))] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[hsl(var(--lux-filter-background))] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[hsl(var(--lux-focus-ring))] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[hsl(var(--lux-filter-background))] [&::-moz-range-thumb]:cursor-pointer"
                            {...props}
                        />
                        <div
                            className="absolute top-0 h-2 rounded-full bg-[hsl(var(--lux-focus-ring))] pointer-events-none"
                            style={{ width: `${percentage(localValue[0])}%` }}
                        />
                    </div>
                )}
            </div>
        );
    }
);
Slider.displayName = "Slider";

export { Slider };

