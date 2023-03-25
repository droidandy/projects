import { Params } from 'api/blog/get-posts';
import { AsyncAction } from 'types/AsyncAction';
import { getBlogCategories, getPosts } from 'api';
import { RequestConfig } from '../../api/request';
import { actions as blogPostsActions } from './reducers';

export const fetchBlogPosts = (requestConfig?: RequestConfig, params?: Params): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(blogPostsActions.setLoading(true));
    return getPosts(requestConfig, params)
      .then(({ data }) => {
        dispatch(blogPostsActions.setBlogPosts({ posts: data, initial }));
      })
      .catch((err) => {
        dispatch(blogPostsActions.setError(err));
      });
  };
};

export const fetchBlogCategories = (): AsyncAction => {
  return function (dispatch) {
    dispatch(blogPostsActions.setLoading(true));
    return getBlogCategories()
      .then(({ data }) => {
        dispatch(blogPostsActions.setBlogCategories({ blogCategories: data }));
      })
      .catch((err) => {
        dispatch(blogPostsActions.setError(err));
      });
  };
};
