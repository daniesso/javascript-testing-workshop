import ArticleMeta from './ArticleMeta';
import React from 'react';
import api from '../../api';
import { connect } from 'react-redux';
import marked from 'marked';
import {
  ARTICLE_PAGE_LOADED,
  ARTICLE_PAGE_UNLOADED,
} from '../../constants/actionTypes';

const mapStateToProps = (state) => ({
  ...state.article,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload) => dispatch({ type: ARTICLE_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: ARTICLE_PAGE_UNLOADED }),
});

class Article extends React.Component {
  async componentDidMount() {
    this.props.onLoad(await api.Articles.get(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.article) {
      return null;
    }

    const markup = {
      __html: marked(this.props.article.text),
    };
    const canModify =
      this.props.currentUser &&
      this.props.currentUser.username === this.props.article.author.username;

    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{this.props.article.title}</h1>
            <ArticleMeta article={this.props.article} canModify={canModify} />
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-xs-12">
              <div dangerouslySetInnerHTML={markup}></div>

              <ul className="tag-list">
                {this.props.article.tags.map((tag) => {
                  return (
                    <li className="tag-default tag-pill tag-outline" key={tag}>
                      {tag}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <hr />

          <div className="article-actions"></div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
