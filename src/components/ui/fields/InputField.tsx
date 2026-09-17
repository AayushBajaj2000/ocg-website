"use client";

import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { RequiredMark } from "@/components/ui/fields/RequiredMark";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "border-field-border ring-brand-blue outline-brand-blue focus:ring-brand-blue focus:outline-brand-blue font-switzer text-black-1 border px-4 text-base";

const CHIP_CLASS =
  "ring-brand-blue outline-brand-blue focus:ring-brand-blue focus:outline-brand-blue font-switzer grid h-10 cursor-pointer place-content-center border px-2.5 text-lg tracking-[-2%]";

type BaseProps = {
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  fieldClassName?: string;
};

type InputProps = BaseProps & {
  isTextarea?: false;
  isMultiSelect?: false;
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps & {
  isTextarea: true;
  isMultiSelect?: false;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type MultiSelectProps = BaseProps & {
  isTextarea?: false;
  isMultiSelect: true;
  options: string[];
  required?: boolean;
  selected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  name?: string;
  id?: string;
};

type Props = InputProps | TextareaProps | MultiSelectProps;

const MultiSelect: React.FC<Omit<MultiSelectProps, "isMultiSelect">> = ({
  label,
  error,
  className,
  labelClassName,
  fieldClassName,
  options,
  required,
  selected,
  onSelectedChange,
  name,
  id,
}) => {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const value = selected ?? internalSelected;

  const toggleIn = (current: string[], option: string) =>
    current.includes(option) ? current.filter((item) => item !== option) : [...current, option];

  const toggle = (option: string) => {
    if (selected === undefined) setInternalSelected((current) => toggleIn(current, option));
    onSelectedChange?.(toggleIn(value, option));
  };

  return (
    <fieldset className={cn("flex w-full flex-col gap-4", className)} id={id}>
      {label && (
        <legend
          className={cn(
            "font-switzer mb-4 text-sm tracking-[-2%] text-black md:text-xl",
            labelClassName,
          )}
        >
          {label}
          {required && <RequiredMark />}
        </legend>
      )}

      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = value.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(option)}
              className={cn(
                CHIP_CLASS,
                isSelected
                  ? "border-brand-blue text-brand-blue"
                  : "border-neutral-300 text-neutral-600",
                fieldClassName,
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="font-switzer text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {name &&
        value.map((option) => <input key={option} type="hidden" name={name} value={option} />)}
    </fieldset>
  );
};

const InputField: React.FC<Props> = ({
  label,
  error,
  className,
  labelClassName,
  fieldClassName,
  isTextarea,
  isMultiSelect,
  ...props
}) => {
  if (isMultiSelect) {
    return (
      <MultiSelect
        label={label}
        error={error}
        className={className}
        labelClassName={labelClassName}
        fieldClassName={fieldClassName}
        {...(props as Omit<MultiSelectProps, keyof BaseProps | "isMultiSelect" | "isTextarea">)}
      />
    );
  }

  const fieldId = props.id ?? props.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;
  const { "aria-describedby": ariaDescribedBy, required } = props as {
    "aria-describedby"?: string;
    required?: boolean;
  };
  const describedBy = cn(ariaDescribedBy, errorId) || undefined;

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn(
            "font-switzer text-sm tracking-[-2%] text-black md:text-xl",
            labelClassName,
          )}
        >
          {label}
          {required && <RequiredMark />}
        </label>
      )}

      {isTextarea ? (
        <textarea
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(FIELD_CLASS, "min-h-32 py-4", error && "border-red-600", fieldClassName)}
        />
      ) : (
        <input
          type="text"
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(FIELD_CLASS, "h-12", error && "border-red-600", fieldClassName)}
        />
      )}

      {error && (
        <p id={errorId} role="alert" className="font-switzer -mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
