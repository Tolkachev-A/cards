import { Cards } from 'features/packs-list/enums';
import {
  QueryParamsCardType,
  ResponseGateCardType,
  UpdateCardGradeResponseType,
} from 'features/packs-list/types';

export const updateCardGrade = (updatedCard: UpdateCardGradeResponseType) =>
  ({ type: Cards.UPDATE_CARD_GRADE, updatedCard } as const);
export const setQueryParams = (params: QueryParamsCardType) =>
  ({ type: Cards.SET_QUERY_PARAMS, params } as const);
export const setDateCard = (date: ResponseGateCardType) =>
  ({ type: Cards.SET_DATE_CARD, date } as const);
