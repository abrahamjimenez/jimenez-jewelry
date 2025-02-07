"use client"

import { useState } from 'react';
import { InputBase, Combobox, useCombobox } from '@mantine/core';

const sortKeys = [
  "TITLE PRICE",
  "BEST_SELLING",
  "CREATED",
  "ID",
  "MANUAL",
  "COLLECTION_DEFAULT",
  "RELEVANCE"
];

const ComboboxComponent = () => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>("BEST_SELLING");

  const options = sortKeys.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <p>Sort by:</p>
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
