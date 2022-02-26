import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { toPairs } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Separator from '../../../../../../components/separator/Separator';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

const RepeatWeekly = ({
  id,
  weekly: { interval, days, options },
  handleChange,
  translations,
}) => {
  let daysArray = toPairs(days);
  if (options.weekStartsOnSunday) {
    daysArray = daysArray.slice(-1).concat(daysArray.slice(0, -1));
  }

  return (
    <Flex direction={'column'}>
      <Flex direction={'row'} alignItems={'center'}>
        <Text>{translateLabel(translations, 'repeat.weekly.every')}</Text>
        <Separator width={16} />
        <Input
          size={'lg'}
          id={`${id}-interval`}
          name="repeat.weekly.interval"
          aria-label="Repeat weekly interval"
          className="form-control"
          value={interval}
          width={60}
          onChange={numericalFieldHandler(handleChange)}
        />
        <Separator width={16} />
        <Text>{translateLabel(translations, 'repeat.weekly.weeks')}</Text>
      </Flex>
      <Separator height={16} />
      <Flex direction={'row'} alignItems={'center'}>
        {daysArray.map(([dayName, isDayActive]) => (
          <Flex key={dayName} direction={'column'} flexGrow={1}>
            <Button
              isRound
              width={10}
              height={10}
              borderRadius={'50%'}
              key={`${id}-${dayName}`}
              padding={0}
              marginRight={3}
              name={`repeat.weekly.days[${dayName}]`}
              variant={isDayActive ? 'solid' : 'outline'}
              onClick={(event) => {
                const editedEvent = {
                  ...event,
                  target: {
                    ...event.target,
                    value: !isDayActive,
                    name: event.target.name,
                  },
                };

                handleChange(editedEvent);
              }}
            >
              {dayName.slice(0, 1).toUpperCase()}
            </Button>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

RepeatWeekly.propTypes = {
  id: PropTypes.string.isRequired,
  weekly: PropTypes.shape({
    interval: PropTypes.number.isRequired,
    days: PropTypes.shape({
      mon: PropTypes.bool.isRequired,
      tue: PropTypes.bool.isRequired,
      wed: PropTypes.bool.isRequired,
      thu: PropTypes.bool.isRequired,
      fri: PropTypes.bool.isRequired,
      sat: PropTypes.bool.isRequired,
      sun: PropTypes.bool.isRequired,
    }).isRequired,
    options: PropTypes.shape({
      weekStartsOnSunday: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default RepeatWeekly;
