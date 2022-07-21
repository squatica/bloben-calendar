import '../styles/index.css';
import { cloneDeep, set } from 'lodash';
import End from './End/index';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Repeat from './Repeat/index';
import computeRRuleFromString from '../utils/computeRRule/fromString/computeRRule';
import computeRRuleToString from '../utils/computeRRule/toString/computeRRule';
import configureInitialState from '../utils/configureInitialState';
import translations from '../translations';

const ReactRRuleGenerator = (props) => {
  // compute default view based on user's config
  // state = configureInitialState(
  //   this.props.config,
  //   this.props.calendarComponent,
  //   this.props.id
  // );

  const [state, setState] = useState(
    configureInitialState(props.config, props.calendarComponent, props.id)
  );

  useEffect(() => {
    if (props.value) {
      const data = computeRRuleFromString(state.data, props.value);
      setState({ data });
    }
  }, []);
  //
  // componentWillMount() {
  //   if (this.props.onChange === ReactRRuleGenerator.defaultProps.onChange) {
  //     // no onChange() was provided
  //     throw new Error(
  //       "No onChange() function has been passed to RRuleGenerator. \n" +
  //         "Please provide one, it's needed to handle generated value."
  //     );
  //   }
  //
  //   if (this.props.value) {
  //     // if value is provided to RRuleGenerator, it's used to compute state of component's forms
  //     const data = computeRRuleFromString(this.state.data, this.props.value);
  //     this.setState({ data });
  //   }
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.value) {
  //     const data = computeRRuleFromString(this.state.data, nextProps.value);
  //     this.setState({ data });
  //   }
  // }

  const handleChange = ({ target }) => {
    const newData = cloneDeep(state.data);

    set(newData, target.name, target.value);
    const rrule = computeRRuleToString(newData);

    setState({ data: newData });
    props.onChange(rrule);
  };
  const {
    id,
    data: { repeat, end },
  } = state;
  return (
    <>
      <Repeat
        id={`${id}-repeat`}
        repeat={repeat}
        handleChange={handleChange}
        translations={props.translations}
      />
      <End
        id={`${id}-end`}
        end={end}
        handleChange={handleChange}
        translations={props.translations}
      />
    </>
  );
};

ReactRRuleGenerator.propTypes = {
  id: PropTypes.string,
  config: PropTypes.shape({
    frequency: PropTypes.arrayOf(
      PropTypes.oneOf(['Yearly', 'Monthly', 'Weekly', 'Daily'])
    ),
    yearly: PropTypes.oneOf(['on', 'on the']),
    monthly: PropTypes.oneOf(['on', 'on the']),
    end: PropTypes.arrayOf(PropTypes.oneOf(['Never', 'After', 'On date'])),
    hideStart: PropTypes.bool,
    hideEnd: PropTypes.bool,
    hideError: PropTypes.bool,
    weekStartsOnSunday: PropTypes.bool,
  }),
  value: PropTypes.string,
  onChange: PropTypes.func,
  calendarComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
ReactRRuleGenerator.defaultProps = {
  id: null,
  value: '',
  config: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange() {},
  calendarComponent: null,
  translations: translations.english,
};

export default ReactRRuleGenerator;
