import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import user from '../../assets/user.png';
import { clearCurrentArticle, clearError, fetchUser, logOut } from '../../store/fetchSlice';

import classes from './Header.module.scss';

export default function Header() {
  const { currentUser } = useAppSelector((state) => state.fetchReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!currentUser && token) {
      dispatch(fetchUser(token));
    }
  }, []);

  return (
    <header className={classes.header}>
      <Link to="/" className={classes['header-logo']}>
        <h1 className={classes['header-logo_text']}>Realworld Blog</h1>
      </Link>
      {currentUser ? (
        <div className={classes['header-btn']}>
          <Link
            onClick={() => {
              dispatch(clearError('all'));
              dispatch(clearCurrentArticle());
            }}
            to="/new-article"
          >
            <button className={classes['header-btn_create']} type="button">
              Create article
            </button>
          </Link>
          <Link to="/profile">
            <div className={classes['header-user-info']}>
              <h2 className={classes['header-user-info_title']}>{currentUser.username} </h2>
              <img
                src={currentUser.image ? currentUser.image : user}
                alt="UserImg"
                className={classes['header-user-img']}
              />
            </div>
          </Link>
          <Link to="/">
            <button
              onClick={() => dispatch(logOut())}
              className={classes['header-btn_signin']}
              type="button"
            >
              Log Out
            </button>
          </Link>
        </div>
      ) : (
        <div className={classes['header-btn']}>
          <Link to="/sign-in">
            <button className={classes['header-btn_signin']} type="button">
              Sign In
            </button>
          </Link>
          <Link to="/sign-up">
            <button className={classes['header-btn_signup']} type="button">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
