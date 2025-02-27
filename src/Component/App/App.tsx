import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Card from '../Card/Card';
import CardList from '../CardList/CardList';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import EditProfile from '../EditProfile/EditProfile';
import Header from '../Header/Header';
import ArticleForm from '../ArticleForm/ArticleForm';

import classes from './App.module.scss';

export default function App() {
  return (
    <Router>
      <div className={classes.app}>
        <Header />
        <main className={classes['app-main']}>
          <Switch>
            <Route
              path="/articles/:slug"
              exact
              render={({ match }) => {
                const { slug } = match.params;
                return <Card articleSlug={slug} />;
              }}
            />
            <Route path="/sign-in" exact component={SignIn} />
            <Route path="/sign-up" exact component={SignUp} />
            <Route path="/profile" exact component={EditProfile} />
            <Route path="/new-article" exact component={ArticleForm} />
            <Route
              path="/articles/:slug/edit"
              exact
              render={({ match }) => {
                const { slug } = match.params;
                return <ArticleForm articleSlug={slug} />;
              }}
            />

            <Route path="/" exact component={CardList} />
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    </Router>
  );
}
