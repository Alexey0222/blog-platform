// eslint-disable-next-line import/no-extraneous-dependencies
import Markdown from 'marked-react'; // библиотека для рендеринга Markdown
import { useEffect } from 'react';
import { Spin } from 'antd';

import CardHeader from '../CardHeader/CardHeader';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchCard } from '../../store/fetchSlice';

import classes from './Card.module.scss';

export default function Card({ articleSlug }: { articleSlug: string }) {
  const { currentArticle, loading } = useAppSelector((state) => state.fetchReducer);
  const dispatch = useAppDispatch();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(fetchCard({ slug: articleSlug, token }));
    } else {
      dispatch(fetchCard({ slug: articleSlug, token: null }));
    }
  }, [dispatch, articleSlug]);

  function renderArticle() {
    if (!currentArticle) {
      return <span> Not article </span>;
    }

    return (
      <article className={classes.article}>
        <CardHeader isAlone={false} article={currentArticle} />

        <main className={classes.article_content}>
          <Markdown value={currentArticle.body} />
        </main>
      </article>
    );
  }

  return loading ? <Spin /> : <> {renderArticle()}</>;
}
