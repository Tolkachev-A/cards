import React, {useCallback, useEffect, useState} from 'react';
import styles from './Settings.module.css';
import {Search} from './search/Search';
import {OwnerSwitcher} from './owner-switcher/OwnerSwitcher';
import {CardsSlider} from './cards-slider/CardsSlider';
import {DisableFilterButton} from './disable-filter-button/DisableFilterButton';
import {useAppDispatch} from '../../../common/hooks/useAppDispatch';
import {getPacksTC, updateQueryParamsAC} from '../packs-reducer';
import {useAppSelector} from '../../../common/hooks/useAppSelector';

export const styleDisabled = {
    opacity: "0.5"
}

export const Settings = () => {
    const valueSearch = useAppSelector(state => state.packs.queryParams.packName)
    const status = useAppSelector(state=>state.app.status)
    const dispatch = useAppDispatch()

    const [clearFilter, setClearFilter] = useState<boolean>(false)
    const searchHandler = useCallback((packName: string) => {
        dispatch(updateQueryParamsAC({packName}))
    }, [])

    const isLoading = status === "loading"

    return (
        <div className={styles.wrapper}>
            <Search id={'cardPacksSearch'}
                    callback={searchHandler}
                    valueSearch={valueSearch}
                    clearFilter={clearFilter}
                    isLoading={isLoading}
            />
            <OwnerSwitcher isLoading={isLoading}/>
            <CardsSlider clearFilter={clearFilter}
                         setClearFilter={setClearFilter}
                         isLoading={isLoading}/>
            <DisableFilterButton setClearFilter={setClearFilter}
                                 isLoading={isLoading}/>
        </div>
    );
};

