"use client";

import { useState } from "react";
import { Input, InputBase, Combobox, useCombobox } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

const sortKeys = [
  "BEST_SELLING",
  "TITLE",
  "PRICE",
  "RELEVANCE",
  // "CREATED",
  // "ID",
  // "MANUAL",
  // "COLLECTION_DEFAULT"
];

const ComboboxComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  // Get initial sortKey from URL or default
  const [value, setValue] = useState<string | null>(
    searchParams.get("sortKey")
  );

  const options = sortKeys.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (val: string) => {
    setValue(val);
    combobox.closeDropdown();

    // Update URL with new sortKey
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortKey", val);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className={"pb-2"}>
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
        <div className={"flex gap-2 justify-end"}>
          <p className={"text-xs md:text-sm text-gray-800 pt-3"}>Sort by:</p>
          <div className={"min-w-[200px] md:min-w-[200px] lg:min-w-[250px]"}>
            <Combobox.Target>
              <InputBase
                variant={"filled"}
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => combobox.toggleDropdown()}
              >
                {value ?? (
                  <Input.Placeholder>
                    <p className={"text-gray-600"}>
                    Pick a value
                    </p>
                  </Input.Placeholder>
                )}
              </InputBase>
            </Combobox.Target>
          </div>
        </div>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
};

export default ComboboxComponent;
