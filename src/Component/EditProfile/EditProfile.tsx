import { SubmitHandler, useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { clearError, fetchUserEdit } from '../../store/fetchSlice';

import classes from './EditProfile.module.scss';

export interface IFieldEdit {
  username: string;
  email: string;
  password: string;
  avatar: string;
}

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const history = useHistory();

  const { loading, error, currentUser } = useAppSelector((state) => state.fetchReducer);

  const {
    register,
    formState: { errors, submitCount, isSubmitting },
    handleSubmit,
    // reset,
  } = useForm<IFieldEdit>({
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<IFieldEdit> = (data) => {
    if (token && currentUser) {
      dispatch(
        fetchUserEdit({
          body: {
            user: {
              username: data.username,
              email: data.email,
              password: data.password,
              image: data.avatar,
            },
          },
          token,
        })
      );
    }
  };

  useEffect(() => {
    if (submitCount && !error && !loading && !isSubmitting && !Object.keys(errors).length) {
      history.push('/');
    }
  }, [isSubmitting, loading]);

  function renderErrors(field: 'username' | 'email') {
    if (typeof error === 'object') {
      if (error[field]) {
        return (
          <span className={classes['form-edit-profile-error']}>{`${field} уже существует`}</span>
        );
      }
    }
    return null;
  }

  return !token ? (
    <Redirect to="/" />
  ) : (
    <div className={classes['form-wrap']}>
      <form onSubmit={handleSubmit(onSubmit)} className={classes['form-edit-profile']}>
        <h2 className={classes['form-edit-profile-title']}>Edit Profile</h2>
        <fieldset className={classes['form-edit-profile-inputs']}>
          <label className={classes['form-edit-profile-label']}>
            Username
            <input
              {...register('username', {
                required: 'Поле обязательно к заполнению',
                minLength: {
                  value: 3,
                  message: 'Минимум 3 символа',
                },
                maxLength: {
                  value: 20,
                  message: 'Максимум 20 символов',
                },

                pattern: {
                  value: /^[a-z0-9_-]{3,20}$/,
                  message: 'Please enter valid username!',
                },
                onChange: () => dispatch(clearError('username')),
              })}
              placeholder="Username"
              className={classes['form-edit-profile-input']}
              type="text"
            />
          </label>
          {errors.username && (
            <span className={classes['form-edit-profile-error']}>
              {errors.username.message as string}
            </span>
          )}
          {renderErrors('username')}

          <label className={classes['form-edit-profile-label']}>
            Email address
            <input
              {...register('email', {
                required: 'Поле Email обязательно к заполнению',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
                  message: 'Please enter valid email!',
                },
                onChange: () => dispatch(clearError('email')),
              })}
              placeholder="Email address"
              className={classes['form-edit-profile-input']}
              type="email"
            />
          </label>
          {errors.email && (
            <span className={classes['form-edit-profile-error']}>
              {errors.email.message as string}
            </span>
          )}
          {renderErrors('email')}

          <label className={classes['form-edit-profile-label']}>
            New Password
            <input
              {...register('password', {
                required: 'Поле обязательно к заполнению',
                minLength: {
                  value: 6,
                  message: 'Минимум 6 символов',
                },
                maxLength: {
                  value: 40,
                  message: 'Максимум 40 символов',
                },
                pattern: {
                  value: /^(?=.*[a-z]*)(?=.*[A-Z]*)(?=.*\d*)[^\s]{6,40}$/i,
                  message: 'Please enter valid password!',
                },
              })}
              placeholder="New password"
              className={classes['form-edit-profile-input']}
              type="password"
            />
          </label>
          {errors.password && (
            <span className={classes['form-edit-profile-error']}>
              {errors.password.message as string}
            </span>
          )}

          <label className={classes['form-edit-profile-label']}>
            Avatar image(url)
            <input
              {...register('avatar')}
              placeholder="Avatar image"
              className={classes['form-edit-profile-input']}
              type="url"
            />
          </label>
          {errors.avatar && (
            <span className={classes['form-edit-profile-error']}>
              {errors.avatar.message as string}
            </span>
          )}
        </fieldset>
        <button className={classes['form-edit-profile-button']} type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
