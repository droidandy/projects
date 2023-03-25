import React, { ElementType, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import { useStyles } from './wrapper.styles';

// region Types
type DndWrapperClassKey = keyof ReturnType<typeof useStyles>;
interface DndWrapperComponentProps {
  ref?: React.Ref<HTMLElement>;
}

export interface DndWrapperTypeMap<
  P extends DndWrapperComponentProps = DndWrapperComponentProps,
  D extends ElementType = 'div',
> {
  props: P & {
    id: string;
    findIndex: (id: string) => number;
    onMove: (id: string, atIndex: number) => void;
  };
  defaultComponent: D;
  classKey: DndWrapperClassKey;
}

interface DndItem {
  id: string;
  originalIndex: number;
}

export type DndWrapperProps<
  D extends ElementType = DndWrapperTypeMap['defaultComponent'],
  P = DndWrapperComponentProps,
> = OverrideProps<DndWrapperTypeMap<P, D>, D>;
// endregion

export const DndWrapper = <C extends ElementType>({
  component,
  classes: propClasses,
  findIndex,
  onMove,
  ...props
}: { component?: C } & DndWrapperProps<C>) => {
  //region Overrides & styles
  const classes = useStyles();
  const FinalComponent = useMemo(() => component || 'div', [component]);
  //endregion

  //region DnD
  const [, drag] = useDrag(
    () => ({
      type: 'type',
      item: { id: props.id, originalIndex: findIndex(props.id) },
      // collect: (monitor) => ({
      //   isDragging: monitor.isDragging(),
      // }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          onMove(droppedId, originalIndex);
        }
      },
    }),
    [findIndex, onMove],
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'type',
      canDrop: () => true,
      hover({ id: draggedId }: DndItem) {
        if (draggedId !== props.id) {
          const overIndex = findIndex(props.id);
          onMove(draggedId, overIndex);
        }
      },
    }),
    [findIndex, onMove],
  );
  //endregion
  const ref = useRef(null);
  drag(drop(ref));

  return <FinalComponent className={classes.root} ref={ref} {...props} />;
};
