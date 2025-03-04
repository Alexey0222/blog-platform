import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchCreateUser, clearError } from '../../store/fetchSlice';

import classes from './SignUp.module.scss';

export interface IField {
  username: string;
  email: string;
  password: string;
  passwordrepeat: string;
  checkbox: boolean;
}

export default function SignUp() {
  const dispatch = useAppDispatch();
  // token – если он есть, пользователь уже авторизован
  const token = localStorage.getItem('token');
  //  состояние загрузки и ошибок из Redux
  const { loading, error } = useAppSelector((state) => state.fetchReducer);
  // для редиректа после успешной регистрации
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, submitCount, isSubmitting },
    handleSubmit,
    watch,
  } = useForm<IField>();

  const onSubmit: SubmitHandler<IField> = (data) => {
    dispatch(
      fetchCreateUser({
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      })
    );
  };
  // Редирект при успешной регистрации
  useEffect(() => {
    if (submitCount && !error && !loading && !isSubmitting && !Object.keys(errors).length) {
      navigate('/');
    }
  }, [isSubmitting, loading]);

  function renderErrors(field: 'username' | 'email') {
    if (typeof error === 'object') {
      if (error[field]) {
        return <span className={classes['form-sign-up-error']}>{`${field} уже существует`}</span>;
      }
    }
    return null;
  }
  // Добавляет класс --warning, если есть ошибка в поле
  function inputClasses(input: keyof IField) {
    return classNames(classes['form-sign-up-input'], {
      [classes['form-sign-up-input--warning']]: errors[input],
    });
  }
  // Если в localStorage есть token, пользователя перенаправляет на /
  return token ? (
    <Navigate to="/" />
  ) : (
    <div className={classes['form-wrap']}>
      <form onSubmit={handleSubmit(onSubmit)} className={classes['form-sign-up']}>
        <h2 className={classes['form-sign-up-title']}>Create new account</h2>
        <fieldset className={classes['form-sign-up-inputs']}>
          <label className={classes['form-sign-up-label']}>
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
              className={inputClasses('username')}
              type="text"
            />
          </label>
          {errors.username && (
            <span className={classes['form-sign-up-error']}>
              {errors.username.message as string}
            </span>
          )}
          {renderErrors('username')}
          <label className={classes['form-sign-up-label']}>
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
              className={inputClasses('email')}
              type="email"
            />
          </label>
          {errors.email && (
            <span className={classes['form-sign-up-error']}>{errors.email.message as string}</span>
          )}
          {renderErrors('email')}
          <label className={classes['form-sign-up-label']}>
            Password
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
              placeholder="Password"
              className={inputClasses('password')}
              type="password"
            />
          </label>
          {errors.password && (
            <span className={classes['form-sign-up-error']}>
              {errors.password.message as string}
            </span>
          )}

          <label className={classes['form-sign-up-label']}>
            Repeat Password
            <input
              {...register('passwordrepeat', {
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
                validate: (value) => value === watch('password') || 'Пароли не совпадают',
              })}
              placeholder="Password"
              className={inputClasses('passwordrepeat')}
              type="password"
            />
          </label>
          {errors.passwordrepeat && (
            <span className={classes['form-sign-up-error']}>
              {errors.passwordrepeat.message as string}
            </span>
          )}
        </fieldset>

        <label className={classes['form-sign-up-checkbox']}>
          <input
            {...register('checkbox', {
              required: 'Поле обязательно к заполнению',
            })}
            className={classes['form-sign-up-checkbox-input']}
            type="checkbox"
          />
          <span className={classes['form-sign-up-checkbox-text']}>
            I agree to the processing of my personal information <br />
            {errors.checkbox && (
              <span className={classes['form-sign-up-error']}>
                {errors.checkbox.message as string}
              </span>
            )}
          </span>
        </label>

        <button className={classes['form-sign-up-button']} type="submit">
          Create
        </button>
        <span className={classes['form-sign-up-span']}>
          Already have an account?
          <Link className={classes['form-sign-up-link']} to="/sign-in">
            {' '}
            Sign In.
          </Link>
        </span>
      </form>
    </div>
  );
}
