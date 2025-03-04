import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';

import Card from '../Card/Card';
import CardList from '../CardList/CardList';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import EditProfile from '../EditProfile/EditProfile';
import Header from '../Header/Header';
import ArticleForm from '../ArticleForm/ArticleForm';

import classes from './App.module.scss';

function CardWithSlug() {
  const params = useParams();
  const slug = params.slug ?? ''; // Если slug отсутствует, передаем пустую строку

  return <Card articleSlug={slug} />;
}

function ArticleFormWithSlug() {
  const params = useParams();
  const slug = params.slug ?? '';

  return <ArticleForm articleSlug={slug} />;
}

export default function App() {
  return (
    <Router>
      <div className={classes.app}>
        <Header />
        <main className={classes['app-main']}>
          <Routes>
            <Route path="/articles/:slug" element={<CardWithSlug />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/new-article" element={<ArticleForm articleSlug={null} />} />
            <Route path="/articles/:slug/edit" element={<ArticleFormWithSlug />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<CardList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
