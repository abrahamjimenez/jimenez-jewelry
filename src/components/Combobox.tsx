"use client";

import { useState } from "react";
import { InputBase, Combobox, useCombobox } from "@mantine/core";
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
    <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
      <p className={"text-xs text-gray-500 pt-3"}>Sort by:</p>
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {value}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default ComboboxComponent;
