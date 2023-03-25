import React from 'react';
import { Divider, Typography } from '@marketplace/ui-kit';
import { useStyles } from './StepsBlockMobile.styles';

export const StepsBlockMobile = ({ steps }: { steps: JSX.Element[] }) => {
  const { root, titleBlock, contentBlock, contentItem, itemNumber, contentText } = useStyles();
  return (
    <>
      <div className={root}>
        <div className={titleBlock}>
          <Typography component="div" variant="h4">
            Всего три шага
          </Typography>
        </div>
        <Divider />
        <div className={contentBlock}>
          {steps.map((item, index) => (
            <div className={contentItem}>
              <div className={itemNumber}>
                <Typography component="div" variant="h3">
                  {index + 1}
                </Typography>
              </div>
              <div className={contentText}>
                <Typography variant="h5" component="div">
                  {item}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
