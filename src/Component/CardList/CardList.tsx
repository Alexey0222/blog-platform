import uniqid from 'uniqid';
import { useEffect } from 'react';
import { ConfigProvider, Pagination, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { clearCurrentArticle, clearDeleteState, fetchCards } from '../../store/fetchSlice';
import CardHeader from '../CardHeader/CardHeader';

import classes from './CardList.module.scss';

export default function CardList() {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const { articles, articlesCount, currentUser } = useAppSelector((state) => state.fetchReducer);
  const loading = useAppSelector((state) => state.fetchReducer.loading);
  const [searchParams, setSearchParams] = useSearchParams();

  // Получаем текущую страницу из URL, если её нет — устанавливаем 1
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(clearDeleteState());
    dispatch(clearCurrentArticle());

    const offset = 5 * (currentPage - 1); // Смещение для пагинации
    dispatch(fetchCards({ offset, token: token || null }));
  }, [currentUser, currentPage]);

  const cardsItem = articles.map((article) => (
    <li className={classes['cardlist-item']} key={uniqid.time('cards:')}>
      <CardHeader isAlone article={article} />
    </li>
  ));

  return (
    <>
      {loading ? <Spin /> : <ul className={classes.cardlist}>{cardsItem}</ul>}

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ffffff',
          },
          components: {
            Pagination: {
              itemActiveBg: '#1890ff',
            },
          },
        }}
      >
        <Pagination
          className={classes.pagination}
          showSizeChanger={false}
          current={currentPage} // Теперь берём текущую страницу из URL
          total={articlesCount}
          onChange={(value) => {
            setSearchParams({ page: value.toString() }); // Обновляем URL при смене страницы
          }}
        />
      </ConfigProvider>
    </>
  );
}
