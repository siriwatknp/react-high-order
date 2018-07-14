import React from 'react'

export const withRelativeParent = (style) => storyFn => {
  return (
    <div
      className={'with-relative-parent'}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {storyFn()}
    </div>
  );
}
