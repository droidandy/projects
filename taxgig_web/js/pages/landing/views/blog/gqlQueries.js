import { gql } from "apollo-boost";

export const getBlogQuery = limit => gql`
  query {
    blogCategories
    {
      id
      title
    }
    blogs(limit:${limit}) {
      id
      title
      photo_preview {
        url
      }
      blog_category {
        title
      }
    }
  }
`;

export const getBlogByCategoryQuery = (limit, category) => gql`
  query {
    blogCategories
    {
      id
      title
    }
    blogs(limit:${limit}, where: {
        blog_category : {
          id: ${category}
        }
      }) {
          id
          title
          photo_preview {
            url
          }
          blog_category {
            title
          }
    }
  }
`;

export const getBlogItemQuery = id => gql`
  query {
    blog(id:${id}){
      id
      title
      average_price
      request_link
      photo_main{
        url
      }
      Article
    }
    blogs(limit:3){
      id
      title
      photo_preview{
        url
      }
      blog_category{
        title
      }
    }
  }
`;

export const getTermsQuery = () => gql`
  query {
    term {
        title
        subTitle
        description
        section {
           hash
           title
           description    
        }
    } 
  }
`;

export const getPolicyQuery = () => gql`
  query {
     privacyPolicy {
        title
        subTitle
        description
        privacy_section {
          hash
          title
          description
        }
      }
  }
`;
