import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import uniqid from 'uniqid';
import classNames from 'classnames';

import {
  fetchCreateArticle,
  fetchCard,
  fetchEditArticle,
  clearCurrentArticle,
  clearError,
} from '../../store/fetchSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

import classes from './ArticleForm.module.scss';

type IFieldCreateArticle = {
  title: string;
  description: string;
  text: string;
  tags: { name: string }[];
};

export default function ArticleForm({ articleSlug = null }: { articleSlug: string | null }) {
  const navigate = useNavigate();
  const { loading, error, currentArticle, currentUser } = useAppSelector(
    (state) => state.fetchReducer
  );
  const dispatch = useAppDispatch();
  const title = currentArticle?.title || '';
  const description = currentArticle?.description || '';
  const text = currentArticle?.body || '';
  const token = localStorage.getItem('token');

  const {
    control, // useForm создаёт объект control, который передаётся в useFieldArray
    register,
    formState: { errors, submitCount, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<IFieldCreateArticle>({
    defaultValues: {
      tags: (currentArticle?.tagList && [
        ...currentArticle.tagList.map((tag) => ({ name: `${tag}` })),
      ]) || [{ name: '' }],
    },
  });

  useEffect(() => {
    if (articleSlug) {
      dispatch(fetchCard({ slug: articleSlug, token: null }));
    } else {
      dispatch(clearCurrentArticle());
      reset();
      reset({
        tags: [{ name: '' }],
      });
    }
  }, [dispatch, articleSlug]);

  useEffect(() => {
    if (submitCount && !error && !loading && !isSubmitting && !Object.keys(errors).length) {
      navigate(`/articles/${currentArticle?.slug}`);
    }
  }, [isSubmitting, loading]);

  // useFieldArray — управление массивом тегов
  // Позволяет добавлять (append) и удалять (remove) теги
  // fields содержит список элементов (обновляется при изменениях)
  const { append, fields, remove } = useFieldArray({ name: 'tags', control });

  const onSubmit: SubmitHandler<IFieldCreateArticle> = (data) => {
    if (token) {
      if (articleSlug) {
        dispatch(
          fetchEditArticle({
            body: {
              article: {
                title: data.title,
                description: data.description,
                body: data.text,
                tagList: data.tags.map((tag) => tag.name),
              },
            },
            token,
            slug: articleSlug,
          })
        );
      } else {
        dispatch(
          fetchCreateArticle({
            body: {
              article: {
                title: data.title,
                description: data.description,
                body: data.text,
                tagList: data.tags.map((tag) => tag.name),
              },
            },
            token,
          })
        );
      }
    }
  };
  // Добавляем класс ошибки, если поле невалидно
  function inputClasses(input: keyof IFieldCreateArticle) {
    return classNames(classes['form-article-input'], {
      [classes['form-article-input--warning']]: errors[input],
    });
  }

  // Если пользователь не авторизован или редактирует чужую статью → перенаправляет на страницу входа (Redirect).
  return !token ||
    (currentArticle && currentUser && currentArticle.author.username !== currentUser.username) ? (
    <Navigate to="/sign-in" />
  ) : (
    <div className={classes['form-wrap']}>
      <form className={classes['form-article']} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={classes['form-article-title']}>Create new article</h2>
        <label className={classes['form-article-label']}>
          Title
          <input
            {...register('title', {
              required: 'Поле обязательно к заполнению',
              validate: (value) => value.trim() !== '' || 'Поле не может содержать только пробелы',
            })}
            defaultValue={title}
            placeholder="Title"
            className={inputClasses('title')}
            type="text"
          />
        </label>
        {errors.title && (
          <span className={classes['form-article-error']}>{errors.title.message as string}</span>
        )}

        <label className={classes['form-article-label']}>
          Short description
          <input
            {...register('description', {
              required: 'Поле обязательно к заполнению',
              validate: (value) => value.trim() !== '' || 'Поле не может содержать только пробелы',
            })}
            defaultValue={description}
            placeholder="Title"
            className={inputClasses('description')}
            type="text"
          />
        </label>
        {errors.description && (
          <span className={classes['form-article-error']}>
            {errors.description.message as string}
          </span>
        )}

        <label className={classes['form-article-label']}>
          Text
          <textarea
            {...register('text', {
              required: 'Поле обязательно к заполнению',
              validate: (value) => value.trim() !== '' || 'Поле не может содержать только пробелы',
            })}
            defaultValue={text}
            placeholder="Text"
            className={`${inputClasses('text')} ${classes['form-article-input--textarea']}`}
          />
        </label>
        {errors.text && (
          <span className={classes['form-article-error']}>{errors.text.message as string}</span>
        )}

        <section className={classes['form-article-section']}>
          <ul className={classes['form-article-section-list']}>
            Tags
            {fields.map((_, index) => (
              <li key={uniqid.time('tag:')} className={classes['form-article-section-list-item']}>
                <input
                  {...register(`tags.${index}.name`, {})}
                  placeholder="Tag"
                  className={`${classes['form-article-input']} ${classes['form-article-input--tag']}`}
                  type="text"
                />

                <button
                  onClick={() => remove(index)}
                  className={classes['form-article-button--delete']}
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => append({ name: '' })}
            className={classes['form-article-button--add']}
            type="button"
          >
            Add tag
          </button>
        </section>

        <button
          onClick={() => dispatch(clearError('all'))}
          className={classes['form-article-button']}
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
