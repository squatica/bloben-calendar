import '../../components/eventDetail/eventDetailAttendee/EventDetailAttendee.tsx';
import { Button, Text } from '@chakra-ui/react';
import { ChakraInput } from 'bloben-components';
import { Context, StoreContext } from '../../context/store';
import { ITEM_SIZE } from '../../types/enums';
import { map } from 'lodash';
import { parseCssDark } from '../../utils/common';
import { timezones } from '../../utils/timezones';
import React, { useContext, useEffect, useRef, useState } from 'react';

const SearchResult = (props: {
  data: { label: string; value: string }[];
  inputRef: any;
  handleSubmit: any;
  handleClose: any;
}) => {
  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;
  const { data, handleSubmit, handleClose } = props;

  const element = document
    .querySelector('.AttendeeInput')
    ?.getBoundingClientRect();

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
      }}
      onClick={handleClose}
    >
      <div
        className={parseCssDark('EventDetailAttendee__searchContainer', isDark)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{
          top: 40 + (element?.top || 0),
          left: element?.left,
        }}
      >
        {map(data, (item) => {
          return (
            <div
              className={'EventDetailAttendee__searchItem'}
              key={`${item.value}`}
            >
              <Button
                _focus={{ boxShadow: 'none' }}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                variant={'ghost'}
                onClick={() =>
                  handleSubmit({ target: { value: item.value } }, true)
                }
              >
                <Text style={{ fontWeight: 'normal' }}>{item.value}</Text>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ChakraTimezoneSelectProps {
  onSelect: any;
  value: string;
  size?: ITEM_SIZE;
  isDisabled?: boolean;
}
const ChakraTimezoneSelect = (props: ChakraTimezoneSelectProps) => {
  const [zones, setZones] = useState<{ label: string; value: string }[]>([]);
  const [isInFocus, setIsInFocus] = useState(false);
  const inputRef = useRef(null);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>('');

  const { isDisabled, value, onSelect } = props;

  useEffect(() => {
    const data: any = timezones.map((item: string) => ({
      label: item,
      value: item,
    }));

    setZones(data);
    setSearchResult(data);
  }, []);

  const onChange = async (e: any) => {
    const textValue = e.target.value;
    setSearchText(e.target.value);

    const result = zones.filter((item) =>
      item.value.toLowerCase().includes(textValue.toLowerCase())
    );

    setSearchResult(result);
  };
  const handleCloseDropdown = () => {
    setSearchText('');
    setIsInFocus(false);
  };

  const handleClick = (item: any) => {
    setSearchText('');
    onSelect(item.target);
    handleCloseDropdown();
  };

  return (
    <div className={'EventDetailAttendee__input'} style={{ width: '100%' }}>
      <ChakraInput
        ref={inputRef}
        className={'AttendeeInput'}
        size={'md'}
        type="text"
        name={'Timezone'}
        value={searchText.length || isInFocus ? searchText : value}
        variant={isDisabled ? 'unstyled' : 'outline'}
        onChange={onChange}
        isDisabled={isDisabled}
        autoComplete={'off'}
        onKeyPress={onChange}
        onFocus={() => setIsInFocus(true)}
      />
      {isInFocus ? (
        <SearchResult
          data={searchResult}
          inputRef={inputRef}
          handleSubmit={handleClick}
          handleClose={handleCloseDropdown}
        />
      ) : null}
    </div>
  );
};

export default ChakraTimezoneSelect;
