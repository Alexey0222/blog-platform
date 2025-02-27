import { useEffect } from 'react';
import uniqid from 'uniqid';
import { format, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Button, Popconfirm } from 'antd';

import { CardData } from '../../Types/CardTyps';
import like from '../../assets/like.svg';
import likeFill from '../../assets/likeFill.svg';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  fetchDeleteArticle,
  fetchFavoriteArticle,
  fetchUnfavoriteArticle,
} from '../../store/fetchSlice';

import classes from './CardHeader.module.scss';

export default function CardHeader({
  article,
  isAlone = true,
}: {
  article: CardData;
  isAlone: boolean;
}) {
  const { title, author, createdAt, description, tagList, favorited, favoritesCount } = article;
  const { currentUser, isDeleteSuccess, loading } = useAppSelector((state) => state.fetchReducer);
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const formateDate = format(parseISO(createdAt), 'MMMM dd, yyyy', { locale: enGB });
  const history = useHistory();
  let currentUsername;
  if (currentUser) {
    currentUsername = currentUser.username;
  }

  useEffect(() => {
    if (!loading && isDeleteSuccess) {
      history.push('/');
    }
  }, [isDeleteSuccess]);

  const headerClass = classNames({
    [classes['app-card']]: true,
    [classes['app-card--alone']]: isAlone,
  });

  const tagsItem = tagList
    .filter((tag) => tag?.match(/\S/))
    .map((tag) => (
      <li key={uniqid.time('tag:')} className={classes['card-tag-item']}>
        {tag}
      </li>
    ));

  function handleLike() {
    if (token) {
      if (!favorited) {
        dispatch(fetchFavoriteArticle({ token, slug: article.slug }));
      } else {
        dispatch(fetchUnfavoriteArticle({ token, slug: article.slug }));
      }
    }
  }

  return (
    <header className={headerClass}>
      <div className={classes['card-info']}>
        <div className={classes['card-info-wrap']}>
          <div className={classes['card-info-top']}>
            <Link to={`/articles/${article.slug}`} className={classes['card-title_link']}>
              <h2>{title}</h2>
            </Link>
            <button type="button" className={classes.like} onClick={() => handleLike()}>
              {favorited ? <img src={likeFill} alt="LikeFill" /> : <img src={like} alt="Like" />}
              <span>{favoritesCount}</span>
            </button>
          </div>
          <div className={classes.user}>
            <div className={classes['user-info']}>
              <span className={classes['user-info_title']}>{author.username}</span>
              <span className={classes['user-info_date']}>{formateDate}</span>
            </div>
            <img src={author.image} alt="UserImg" className={classes['user-img']} />
          </div>
        </div>

        <ul className={classes['card-tag-list']}>
          {tagList.length > 0 ? (
            tagsItem
          ) : (
            <div className={classes['card-tag-not']}>Not tags..</div>
          )}
        </ul>
      </div>
      <div className={classes['card-article']}>
        <p className={classes['card-article-description']}>{description}</p>
      </div>
      {token && article.author.username === currentUsername && !isAlone && (
        <div className={classes['card-article-change']}>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this article?"
            okText="Yes"
            cancelText="No"
            placement="right"
            onConfirm={() => dispatch(fetchDeleteArticle({ token, slug: article.slug }))}
          >
            <Button danger>Delete</Button>
          </Popconfirm>

          <Link to={`/articles/${article.slug}/edit`}>
            <button type="button" className={classes['card-article-change--edit']}>
              Edit
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
