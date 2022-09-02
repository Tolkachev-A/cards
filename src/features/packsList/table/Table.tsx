import React from 'react';
import {TableContainer} from '@mui/material';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import {useAppSelector} from '../../../common/hooks/useAppSelector';
import {useAppDispatch} from '../../../common/hooks/useAppDispatch';
import {getPacksTC} from '../packs-reducer';
import {CustomTableBody} from './tableBody/CustomTableBody';
import {CustomTableHead} from './TableHead/CustomTableHead';
import {Loading} from '../../../common/components/Loading/Loading';
import {setQueryParams} from '../Cards/cards-reducer';
import {useNavigate} from 'react-router-dom';
import {GetSortPacksType} from '../packs-api';
import {Paginator} from '../../../common/components/pagination/Paginator';

export type HeadCellType = {
    sortKey: string
    sortable: boolean
    title: string
}
const headCells: Array<HeadCellType> = [

    {
        sortKey: 'name',
        title: 'Name',
        sortable: true,
    },
    {
        sortKey: 'cardsCount',
        title: 'Cards',
        sortable: true,
    },
    {
        sortKey: 'updated',
        title: 'Last Updated',
        sortable: true,
    },
    {
        sortKey: 'user_name',
        title: 'Created by',
        sortable: true,
    },
    {
        sortKey: 'actions',
        title: 'Actions',
        sortable: false,
    },

]

export const CardsTable = () => {

    const navigate = useNavigate()
    const cards = useAppSelector(state => state.packs.packs.cardPacks)
    const dispatch = useAppDispatch()
    const myID = useAppSelector(state => state.auth.authData._id)
    const page = useAppSelector(state => state.packs.packs.page)

    const cardPacksTotalCount = useAppSelector(state => state.packs.packs.cardPacksTotalCount)
    const pageCount = useAppSelector(state => state.packs.packs.pageCount)

    const onClickNameHandler = (packId: string) => {
        dispatch(setQueryParams({cardsPack_id: packId}))
        navigate(`/cards/${packId}`)
    }

    const tableHeadCallBack = (queryString: string) => {
        dispatch(getPacksTC({sortPacks: queryString as GetSortPacksType}))
    }
    const changePage = (newPage: number) => {
        dispatch(getPacksTC({page: newPage}))
    }
    const changeRowsPerPage = (rowsPerPage: number) => {
        dispatch(getPacksTC({pageCount: rowsPerPage, page: 1}))
    }
    if (!cards.length) {
        return <Loading/>
    }
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <CustomTableHead sortCallback={tableHeadCallBack} headCells={headCells}/>
                    <CustomTableBody elements={cards} myID={myID} onClickNameHandler={onClickNameHandler}/>
                </Table>
            </TableContainer>
            <Paginator
                page={page}
                rowsPerPage={pageCount}
                totalCount={cardPacksTotalCount}
                changePage={changePage}
                changeRowsPerPage={changeRowsPerPage}
            />
        </>
    )
};

