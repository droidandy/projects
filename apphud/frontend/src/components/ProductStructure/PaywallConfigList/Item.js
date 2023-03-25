import React from "react";
import styles from "./index.module.scss";
import Popover from "../Popover";
import PopoverMenuItem from "../PopoverMenuItem";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import Product from "./Product";
import Button from "../Button";
import {ReactComponent as Actions} from "../assets/actions2.svg";
import {ReactComponent as EditIcon} from "../assets/edit.svg";
import {ReactComponent as RemoveIcon} from "../assets/remove.svg";
import {ReactComponent as DefaultIcon} from "../assets/default.svg";
import EmptyDraggableItem from "./EmptyDraggableItem";


export default function Item({ data = [], id, label, description, isDefault, onEdit, onRemove, onAddProduct, onEditProduct, onRemoveProduct, onDragEnd, onRemoveDefault, onMakeDefault }) {
  return (
    <div className={styles.item}>
      <div className={styles.head}>
        <div className={styles.headCol}>
          <label className={styles.label}>
            {label} { isDefault && <span>Default</span>}
          </label>
          <div className={styles.description}>
            {description}
          </div>
        </div>
        <div className={styles.headCol}>
          <Popover label={<Actions />}>
            <PopoverMenuItem label={<><EditIcon/>&nbsp;Edit</>} onClick={onEdit} />
            {!isDefault && (<PopoverMenuItem label={<><DefaultIcon/>&nbsp;Make default</>} onClick={onMakeDefault} />)}
            {isDefault && (<PopoverMenuItem color="red" label={<><RemoveIcon/>&nbsp;Remove default</>} onClick={onRemoveDefault} />)}
            <PopoverMenuItem color="red" label={<><RemoveIcon/>&nbsp;Remove</>} onClick={onRemove} />
          </Popover>
        </div>
      </div>
      <div className={styles.list}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={id}>
            {(provided, snapshot) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}>
                {data.map((el, key) => (
                  <Draggable key={`${el?.id}`} draggableId={`${el?.id}`} isDragDisabled={!el?.name} index={key}>
                    {(provided, snapshot) => (
                      <li ref={provided.innerRef}
                          style={provided.draggableProps.style}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                        { el?.name
                          ? <Product isLast={key+2 >= data.length} data={el} onEdit={onEditProduct} onRemove={onRemoveProduct} />
                          : <EmptyDraggableItem />
                        }
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className={styles.actions}>
          <Button label="Add product" color="blue" onClick={onAddProduct} />
        </div>
      </div>
    </div>
  );
}
