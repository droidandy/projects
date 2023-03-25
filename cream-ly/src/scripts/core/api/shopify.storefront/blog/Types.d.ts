export {};
declare global {
  namespace Shopify {
    namespace Storefront {
      interface IResponseBlogArticles {
        articles: {
          edges: [
            {
              node: {
               id : string;
               title: string;
               handle: string;
               url: string;
               tags: string [];
               authorV2 : {
                 name: string;
                 bio:string;
               },
               excerptHTML:string;
               excerpt:string;
               contentHtml:string;
               seo : {
                 description: string;
                 title: string;
               },
               blog: {
                url: string;
                handle: string;
                title: string;
               }

              };
            }
          ];
        };
      }

     
  }
}
