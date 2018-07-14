import React from 'react';
import find from 'lodash/find';
import styled from 'react-emotion';
import { space } from 'styled-system';

const Wrapper = styled('div')({
  padding: 15,
  position: 'fixed',
  bottom: 0,
  right: 0,
  display: 'flex',
  '& .swatch': {
    '&:not(:first-child)': {
      marginLeft: 10
    }
  }
}, space);

const Swatch = styled('div')({
  width: 30,
  height: 30,
  borderRadius: 3,
  cursor: 'pointer'
}, ({ color, selected }) => ({
  backgroundColor: color || '#ffffff',
  border: selected ? '3px solid red' : 'none',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.12)'
}));

class BackgroundColors extends React.Component {

  constructor(props) {
    super(props);
    const { colors } = props;
    let defaultColor = '#ffffff';
    if (colors.length > 0) {
      defaultColor = find(colors, ({ defaultColor }) => defaultColor).value || '#ffffff';
    }
    this.state = {
      selectedColor: defaultColor
    };
  }

  render() {
    const { story, colors = [] } = this.props;
    const { selectedColor } = this.state;
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: selectedColor,
          transition: '0.3s'
        }}
      >
        {story()}
        <Wrapper>
          {colors.map(({ value }) => (
            <Swatch
              key={value}
              className={'swatch'}
              onClick={() => this.setState({ selectedColor: value })}
              selected={selectedColor === value}
              color={value}
            />
          ))}
        </Wrapper>
      </div>
    );
  }
}

export default backgroundColors => story => (
  <BackgroundColors colors={backgroundColors} story={story} />
)