import { Action, PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CardData, CreateArticle } from '../Types/CardTyps';
import { User, CreateUser, UserLogin, EditUser } from '../Types/UserTyps';

type Cards = CardData[];

const baseUrl = 'https://blog-platform.kata.academy/api';

export type FetchSliceState = {
  error: string | { username?: string; email?: string; password?: string };
  loading: boolean;
  articles: Cards;
  articlesCount: number;
  currentArticle: CardData | null;
  currentUser: User | null;
  isDeleteSuccess: boolean;
};

const initialState: FetchSliceState = {
  loading: false,
  error: '',
  articles: [],
  articlesCount: 0,
  currentArticle: null,
  currentUser: null,
  isDeleteSuccess: false,
};
// Получение списка статей
export const fetchCards = createAsyncThunk<
  FetchSliceState,
  { offset: number; token: string | null },
  { rejectValue: string }
>('fetch/fetchCards', async (args, { rejectWithValue }) => {
  let response;
  if (args.token) {
    response = await fetch(`${baseUrl}/articles?limit=5&offset=${args.offset}`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${args.token}`,
      },
    });
  } else {
    response = await fetch(`${baseUrl}/articles?limit=5&offset=${args.offset}`);
  }
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
  }
  return data;
});

export const fetchCard = createAsyncThunk<
  CardData,
  { slug: string; token: string | null },
  { rejectValue: string }
>('fetch/fetchCard', async (args, { rejectWithValue }) => {
  let response;
  if (args.token) {
    response = await fetch(`${baseUrl}/articles/${args.slug}`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${args.token}`,
      },
    });
  } else {
    response = await fetch(`${baseUrl}/articles/${args.slug}`);
  }
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
  }
  return data.article;
});
// Создание пользователя
export const fetchCreateUser = createAsyncThunk<User, CreateUser, { rejectValue: string }>(
  'fetch/fetchCreateUser',
  async (body, { rejectWithValue }) => {
    const response = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      if (!('username' in data.errors) && !('email' in data.errors)) {
        if ('email or password' in data.errors) {
          return rejectWithValue('Error, email or password is invalid');
        }
        return rejectWithValue(`Error, ${data.errors.message}`);
      }
      return rejectWithValue(data.errors);
    }
    return data.user;
  }
);

export const fetchUser = createAsyncThunk<User, string, { rejectValue: string }>(
  'fetch/fetchUser',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      const data = await response.json();
      return data.user;
    } catch (error: unknown) {
      return rejectWithValue(`Error: ${(error as Error).message}`);
    }
  }
);

export const fetchUserLogin = createAsyncThunk<User, UserLogin, { rejectValue: string }>(
  'fetch/fetchUserLogin',
  async (body, { rejectWithValue }) => {
    const response = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      if (!('password' in data.errors) && !('email' in data.errors)) {
        if ('email or password' in data.errors) {
          return rejectWithValue('Error, email or password is invalid');
        }
        return rejectWithValue(`Error, ${data.errors.message}`);
      }
      return rejectWithValue(data.errors);
    }
    return data.user;
  }
);

export const fetchUserEdit = createAsyncThunk<
  User,
  { body: EditUser; token: string },
  { rejectValue: string }
>('fetch/fetchUserEdit', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseUrl}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${args.token}`,
    },
    body: JSON.stringify(args.body),
  });
  const data = await response.json();
  if (!response.ok) {
    if (!('username' in data.errors) && !('email' in data.errors)) {
      if ('email or password' in data.errors) {
        return rejectWithValue('Error, email or password is invalid');
      }
      return rejectWithValue(`Error, ${data.errors.message}`);
    }
    return rejectWithValue(data.errors);
  }
  return data.user;
});

export const fetchCreateArticle = createAsyncThunk<
  CardData,
  { body: CreateArticle; token: string },
  { rejectValue: string }
>('fetch/fetchCreateArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseUrl}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${args.token}`,
    },
    body: JSON.stringify(args.body),
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

export const fetchDeleteArticle = createAsyncThunk<
  string,
  { slug: string; token: string },
  { rejectValue: string }
>('fetch/fetchDeleteArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseUrl}/articles/${args.slug}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(data.errors.message);
  }
  return '';
});

export const fetchEditArticle = createAsyncThunk<
  CardData,
  { body: CreateArticle; slug: string; token: string },
  { rejectValue: string }
>('fetch/fetchEditArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseUrl}/articles/${args.slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${args.token}`,
    },
    body: JSON.stringify(args.body),
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

export const fetchFavoriteArticle = createAsyncThunk<
  CardData,
  { slug: string; token: string },
  { rejectValue: string }
>('fetch/fetchFavoriteArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseUrl}/articles/${args.slug}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

export const fetchUnfavoriteArticle = createAsyncThunk<
  CardData,
  { slug: string; token: string },
  { rejectValue: string }
>('fetch/fetchUnfavoriteArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseUrl}/articles/${args.slug}/favorite`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

function isError(action: Action) {
  return action.type.endsWith('rejected');
}

const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {
    logOut: (state) => {
      localStorage.removeItem('token');
      state.currentUser = null;
    },
    clearError: (state, action) => {
      if (action.payload === 'all') {
        state.error = '';
      } else if (typeof state.error === 'object' && action.payload === 'email') {
        delete state.error.email;
      } else if (typeof state.error === 'object' && action.payload === 'username') {
        delete state.error.username;
      } else if (typeof state.error === 'object' && action.payload === 'password') {
        delete state.error.password;
      }
      if (!Object.keys(state.error).length) {
        state.error = '';
      }
    },
    clearDeleteState: (state) => {
      state.isDeleteSuccess = false;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCard.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchCard.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
        state.loading = false;
        state.error = '';
      })
      .addCase(fetchCreateUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchCreateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addCase(fetchUserLogin.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUserLogin.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addCase(fetchUserEdit.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUserEdit.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addCase(fetchCreateArticle.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchCreateArticle.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchEditArticle.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchEditArticle.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeleteArticle.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchDeleteArticle.fulfilled, (state) => {
        state.loading = false;
        state.isDeleteSuccess = true;
      })
      .addCase(fetchFavoriteArticle.pending, (state) => {
        state.error = '';
        /* state.loading = true; */
      })
      .addCase(fetchFavoriteArticle.fulfilled, (state, action) => {
        state.articles[
          state.articles?.findIndex((article) => article.slug === action.payload.slug)
        ] = action.payload;
        state.currentArticle = action.payload;
        /* state.loading = false; */
      })
      .addCase(fetchUnfavoriteArticle.pending, (state) => {
        state.error = '';
        /* state.loading = true; */
      })
      .addCase(fetchUnfavoriteArticle.fulfilled, (state, action) => {
        state.articles[
          state.articles?.findIndex((article) => article.slug === action.payload.slug)
        ] = action.payload;
        state.currentArticle = action.payload;
        /* state.loading = false; */
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logOut, clearError, clearDeleteState, clearCurrentArticle } = fetchSlice.actions;
export default fetchSlice.reducer;
