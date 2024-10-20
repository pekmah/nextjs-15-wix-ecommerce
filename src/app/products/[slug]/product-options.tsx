import { Label } from "@/components/ui/label";
import { products } from "@wix/stores";
import React from "react";

interface IProductOptionsProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
}

export default function ProductOptions({
  product,
  selectedOptions,
  setSelectedOptions,
}: IProductOptionsProps) {
  return (
    <div className="space-y-2.5">
      {product.productOptions?.map((option) => (
        <fieldset key={option?.name} className="space-y-1.5">
          <legend>
            <Label asChild>
              <span>{option.name}</span>
            </Label>
          </legend>

          <div className="5 flex flex-wrap items-center gap-1">
            {option.choices?.map((choice) => (
              <div key={choice?.description}>
                <input
                  id={choice.description}
                  type="radio"
                  name={option.name}
                  value={choice.description}
                  className="peer hidden"
                  checked={
                    selectedOptions[option.name || ""] === choice.description
                  }
                  onChange={() =>
                    setSelectedOptions({
                      ...selectedOptions,
                      [option.name || ""]: choice.description || "",
                    })
                  }
                />
                <Label
                  htmlFor={choice.description}
                  className="flex min-w-14 cursor-pointer items-center justify-center gap-1.5 rounded border p-2 peer-checked:border-primary"
                >
                  {option.optionType === products.OptionType.color && (
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: choice.value }}
                    />
                  )}
                  <span>{choice.description}</span>
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}