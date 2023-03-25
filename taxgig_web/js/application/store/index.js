import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunkMiddleware from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createRootReducer from "../reducers";

const loggerMiddleware = createLogger({
	level: "info",
	collapsed: true
});

export const history = createBrowserHistory();

// Build the middleware for intercepting and dispatching navigation actions
const reduxRouterMiddleware = routerMiddleware(history);

const getMiddleware = () => {
	if (process.env.NODE_ENV === "production") {
		return applyMiddleware(reduxRouterMiddleware, thunkMiddleware);
	} else {
		return applyMiddleware(
			reduxRouterMiddleware,
			thunkMiddleware,
			loggerMiddleware
		);
	}
};

export const store = createStore(
	createRootReducer(history),
	composeWithDevTools(getMiddleware())
);
