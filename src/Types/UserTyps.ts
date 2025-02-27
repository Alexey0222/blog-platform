export type UserLogin = {
  user: {
    email: string;
    password: string;
  };
};

export type CreateUser = {
  user: {
    username: string;
    email: string;
    password: string;
  };
};

export type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
};

export type EditUser = {
  user: {
    email: string;
    username: string;
    bio?: string;
    image?: string | null;
    password?: string | null;
  };
};
