import React, {useState} from 'react';
import {TableCell, TableSortLabel} from "@mui/material";
import {HeadCellType} from "../../Table";

type HeadCellPropsType = {
    sortCallback?: (queryString: string) => void
    headCell: HeadCellType
}
export const HeadCell = ({headCell, sortCallback}: HeadCellPropsType) => {
    const {sortKey, title, sortable} = headCell
    const [active, setActive] = useState(false)
    const [direction, setDirection] = useState(false)

    const toggleDirection = () => {
        setDirection(!direction)
        sortCallback && sortCallback(`${direction?"0":"1"}${sortKey}`)
    }
    const onActiveHandler = () => {
        setActive(!active)
    }
    const directionString = direction ? "asc" : "desc"

    return (
        <>
            {sortable ? <TableCell key={sortKey}>
                    <TableSortLabel
                        onClick={toggleDirection}
                        onFocus={onActiveHandler}
                        onBlur={onActiveHandler}
                        active={active}
                        direction={directionString}
                    >
                        {title}
                    </TableSortLabel>
                </TableCell>
                : <TableCell style={{textAlign:"end"}} key={sortKey}>{title}</TableCell>}
        </>

    );
};