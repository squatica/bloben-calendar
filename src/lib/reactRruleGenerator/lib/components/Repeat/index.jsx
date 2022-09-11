import { Flex, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { Separator } from 'bloben-components';
import PropTypes from 'prop-types';
import React from 'react';
import RepeatDaily from './Daily';
import RepeatMonthly from './Monthly';
import RepeatWeekly from './Weekly';
import RepeatYearly from './Yearly';
import translateLabel from '../../utils/translateLabel';

const Repeat = ({
  id,
  repeat: { frequency, yearly, monthly, weekly, daily, options },
  handleChange,
  translations,
}) => {
  const isOptionAvailable = (option) =>
    !options.frequency || options.frequency.indexOf(option) !== -1;
  const isOptionSelected = (option) => frequency === option;

  return (
    <Flex direction={'column'}>
      <FormControl>
        <FormLabel>{translateLabel(translations, 'repeat.label')}</FormLabel>
        <Select
          size={'lg'}
          name="repeat.frequency"
          id={`${id}-frequency`}
          className="form-control"
          value={frequency}
          onChange={handleChange}
        >
          {isOptionAvailable('Yearly') && (
            <option value="Yearly">
              {translateLabel(translations, 'repeat.yearly.label')}
            </option>
          )}
          {isOptionAvailable('Monthly') && (
            <option value="Monthly">
              {translateLabel(translations, 'repeat.monthly.label')}
            </option>
          )}
          {isOptionAvailable('Weekly') && (
            <option value="Weekly">
              {translateLabel(translations, 'repeat.weekly.label')}
            </option>
          )}
          {isOptionAvailable('Daily') && (
            <option value="Daily">
              {translateLabel(translations, 'repeat.daily.label')}
            </option>
          )}
          {/*{isOptionAvailable("Hourly") && (*/}
          {/*  <option value="Hourly">*/}
          {/*    {translateLabel(translations, "repeat.hourly.label")}*/}
          {/*  </option>*/}
          {/*)}*/}
        </Select>
      </FormControl>
      <Separator height={20} />
      {isOptionSelected('Yearly') && (
        <RepeatYearly
          id={`${id}-yearly`}
          yearly={yearly}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {isOptionSelected('Monthly') && (
        <RepeatMonthly
          id={`${id}-monthly`}
          monthly={monthly}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {isOptionSelected('Weekly') && (
        <RepeatWeekly
          id={`${id}-weekly`}
          weekly={weekly}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {isOptionSelected('Daily') && (
        <RepeatDaily
          id={`${id}-daily`}
          daily={daily}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {/*{isOptionSelected("Hourly") && (*/}
      {/*  <RepeatHourly*/}
      {/*    id={`${id}-hourly`}*/}
      {/*    hourly={hourly}*/}
      {/*    handleChange={handleChange}*/}
      {/*    translations={translations}*/}
      {/*  />*/}
      {/*)}*/}
      <Separator height={16} />
    </Flex>
  );
};

Repeat.propTypes = {
  id: PropTypes.string.isRequired,
  repeat: PropTypes.shape({
    frequency: PropTypes.oneOf([
      'Yearly',
      'Monthly',
      'Weekly',
      'Daily',
      'Hourly',
    ]).isRequired,
    yearly: PropTypes.object.isRequired,
    monthly: PropTypes.object.isRequired,
    weekly: PropTypes.object.isRequired,
    daily: PropTypes.object.isRequired,
    hourly: PropTypes.object.isRequired,
    options: PropTypes.shape({
      frequency: PropTypes.arrayOf(
        PropTypes.oneOf(['Yearly', 'Monthly', 'Weekly', 'Daily', 'Hourly'])
      ),
      yearly: PropTypes.oneOf(['on', 'on the']),
      monthly: PropTypes.oneOf(['on', 'on the']),
    }).isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default Repeat;
