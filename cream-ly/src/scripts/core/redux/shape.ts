import videosFilterShape from "../../react-components/PageVideos/VideosFilter/reducers/shape";
import QuizShape from "./quiz/shape";
import CustomerShape from "./customer/shape";
import { ThemeShape } from "./theme/";
import { AppShape } from "./app/";

export default interface StoreShape {
  theme: ThemeShape;
  app: AppShape;
  quiz: QuizShape;
  products: {
    list: Array<any>;
    videos: Array<any>;
  };
  customer: CustomerShape;
  videosFilter: videosFilterShape;
}
