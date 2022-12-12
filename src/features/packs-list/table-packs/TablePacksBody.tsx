import React from 'react';

import { TableCell, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import deleteImg from '../../../assets/images/cardPackBtns/delete.svg';
import edit from '../../../assets/images/cardPackBtns/edit.svg';
import study from '../../../assets/images/cardPackBtns/study.svg';
import { DeleteModal } from '../../../common/components/modals/delete-modal/DeleteModal';
import { routePath } from '../../../common/constants/routePath';
import { useAppDispatch } from '../../../common/hooks/useAppDispatch';
import { dateConverter, timeConverter } from '../../../common/utils/date-converter';
import { EditAddModalPack } from '../edit-add-modal-pack/EditAddModalPack';
import { PackType } from '../packs-api';
import { changePackNameTC, deletePackTC } from '../packs-reducer';

import styles from 'common/components/table/style/Table.module.css';

type CustomTableRowPropsType = {
  el: PackType;
  myID: string;
  onClickNameHandler: (packId: string) => void;
  width: number;
};

export const TablePacksBody = ({
  el,
  myID,
  onClickNameHandler,
  width,
}: CustomTableRowPropsType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isNoCards = el.cardsCount === 0;

  const redirectToStudy = () => {
    return navigate(routePath.cards.learn + el._id);
  };
  const changePackName = (name: string, deckCover: string) => {
    dispatch(changePackNameTC({ _id: el._id, name, deckCover }));
  };
  const deletePack = () => {
    dispatch(deletePackTC(el._id));
  };

  const studyBtnClasses = isNoCards
    ? `${styles.btn} ${styles.btnDisabled}`
    : `${styles.btn}`;
  const alignAdaptiveRight = width < 991 ? 'left' : 'right';
  const alignAdaptiveCenter = width < 991 ? 'center' : 'left';
  const adaptivePadding = width < 991 ? '10px 0 10px 10px' : '16px';

  return (
    <TableRow key={el._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell
        component="th"
        scope="row"
        onClick={() => onClickNameHandler(el._id)}
        style={{
          padding: `${adaptivePadding}`,
          cursor: 'pointer',
          maxWidth: '200px',
          overflowWrap: 'break-word',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
        >
          {
            // Проверка на длины строки поставил, т.к. в некоторых колодах вместо адреса
            // или base64 хардкодили текст типа "Some cover" и отображалась битая картинка
            el.deckCover && el.deckCover.length > 15 && (
              <img
                src={el.deckCover}
                style={{ width: '60px', height: '40px', objectFit: 'contain' }}
              />
            )
          }
          {el.name}
        </div>
      </TableCell>
      <TableCell
        align={alignAdaptiveCenter}
        style={{
          padding: `${adaptivePadding}`,
        }}
      >
        {el.cardsCount}
      </TableCell>
      {width > 991 && (
        <TableCell align="left">
          {dateConverter(el.updated)}
          <br />
          {timeConverter(el.updated)}
        </TableCell>
      )}
      {width > 576 && <TableCell align="left">{el.user_name}</TableCell>}
      <TableCell
        align={alignAdaptiveRight}
        style={{
          padding: `${adaptivePadding}`,
        }}
      >
        {myID === el.user_id ? (
          <div className={styles.btnBlock}>
            <button
              onClick={redirectToStudy}
              disabled={isNoCards}
              className={studyBtnClasses}
              style={{ backgroundImage: `url(${study})` }}
            />
            <EditAddModalPack
              title="Edit pack"
              name={el.name}
              deckCover={el.deckCover}
              saveCallback={changePackName}
              childrenDiv={
                <button
                  className={styles.btn}
                  style={{ backgroundImage: `url(${edit})` }}
                />
              }
            />
            <DeleteModal
              title="Delete Pack"
              name={el.name}
              deleteCallback={deletePack}
              childrenDiv={
                <button
                  className={styles.btn}
                  style={{ backgroundImage: `url(${deleteImg})` }}
                />
              }
            />
          </div>
        ) : (
          <div className={styles.btnBlock}>
            <button
              onClick={redirectToStudy}
              disabled={isNoCards}
              className={studyBtnClasses}
              style={{ backgroundImage: `url(${study})` }}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};