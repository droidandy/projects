import Keys from '../Keys';
import { UsersEP } from './routes';
import qs from 'query-string';
import { generateUniqueId } from '../../utils';
import jwtDecode from 'jwt-decode';
import shortid from 'shortid';
import { IResetPasswordPayload } from '../../types/interfaces';
import authApi from './authInstance';
import { setCrumbizApiAuthorizationHeader } from './utils';

export interface IDecodedAccessToken {
	sub: string;
}

interface IMethodResponse {
	success?: boolean;
}

interface IError {
	code: number | string;
	description: string;
}

export interface ILoginMethodResponse extends IMethodResponse {
	accessToken?: string;
	refreshToken?: string;
	expiresIn?: number;
	error?: IError;
}

export interface IRegisterMethodResponse extends ILoginMethodResponse {
	errors?: Array<IError>;
}

export interface IRefreshToken extends ILoginMethodResponse {
	tokenExpDate: Date;
	refreshExpDate: Date;
}
export interface IRegisterParams {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

interface IAuthSchema {
	login(username: string, password: string): Promise<ILoginMethodResponse>;
	register(values: IRegisterParams): Promise<IRegisterMethodResponse>;
	refreshToken(refreshToken: string): Promise<ILoginMethodResponse>;
}

enum GrantTypesEnum {
	LOGIN = 'password',
	REFRESH_TOKEN = 'refresh_token'
}

class Auth implements IAuthSchema {
	private readonly responseType = 'id_token token';
	private readonly scope = 'openid profile offline_access email';
	private readonly commonQuery = {
		client_id: Keys.AUTH_CLIENT_ID,
		client_secret: Keys.AUTH_CLIENT_SECRET,
		response_type: this.responseType,
		redirect_uri: Keys.AUTH_REDIRECT_URI,
		scope: this.scope
	};

	async login(username: string, password: string) {
		try {
			const data = {
				...this.commonQuery,
				username,
				password,
				grant_type: GrantTypesEnum.LOGIN,
				nonce: generateUniqueId()
			};

			const response = await authApi.post('/connect/token', qs.stringify(data));
			const { expires_in, access_token, refresh_token } = response.data;
			return {
				expiresIn: expires_in,
				accessToken: access_token,
				refreshToken: refresh_token
			};
		} catch (ex) {
			throw new Error(ex);
		}
	}

	/*
	 * Register flow.
	 * First, we need to add the user to Azure. After we added the user to Azure, we execute a login call to get the access token.
	 * Only when we have the access token, we can finally register the user to Crumbiz api.
	 * */
	async register(registerParams: IRegisterParams) {
		try {
			const { email, password, firstName, lastName } = registerParams;
			// Register the user to Azure.
			await authApi.post(
				'/api/user/Register',
				qs.stringify({ email, password, firstName })
			);
			// Execute login request and get the accessToken.

			const { accessToken, refreshToken, expiresIn } = await this.login(
				email,
				password
			);

			// Get the authId ('sub' property) from the access token.
			const authId = jwtDecode<IDecodedAccessToken>(accessToken!).sub;
			// Register the user to Crumbiz.
			setCrumbizApiAuthorizationHeader(accessToken);
			await UsersEP.create({
				firstName,
				lastName,
				authId,
				userEmails: [
					{
						email: email.toLocaleLowerCase(),
						asDefault: true,
						userEmailPreferences: []
					}
				],
				timestamp: new Date()
			});
			return {
				success: true,
				accessToken: accessToken,
				refreshToken: refreshToken,
				expiresIn: expiresIn
			};
		} catch (ex) {
			throw new Error(ex);
		}
	}

	async refreshToken(refreshToken: string) {
		try {
			const data = {
				...this.commonQuery,
				nonce: shortid.generate(),
				refresh_token: refreshToken,
				grant_type: GrantTypesEnum.REFRESH_TOKEN
			};
			const response = await authApi.post('/connect/token', qs.stringify(data));
			const { access_token, refresh_token } = response.data;
			return {
				accessToken: access_token,
				refreshToken: refresh_token
			};
		} catch (ex) {
			throw new Error(ex);
		}
	}

	async forgotPassword(email: string) {
		try {
			await authApi.post('/api/user/ForgotPassword', qs.stringify({ email }));
		} catch (ex) {
			throw new Error(ex);
		}
	}

	async changePassword(NewPassword: string): Promise<void> {
		try {
			await authApi.post(
				'/api/user/ChangePassword',
				qs.stringify({ NewPassword })
			);
		} catch (ex) {
			throw new Error(ex);
		}
	}
	async resetPassword({ password, code, email }: IResetPasswordPayload) {
		try {
			const response = await authApi.post(
				'/api/user/ResetPassword',
				qs.stringify({ password, code, email })
			);
			return response.data;
		} catch (ex) {
			throw new Error(ex);
		}
	}

	async confirmRegisteration(email: string, code: string) {
		try {
			const { succeeded, errors } = await authApi.post(
				'/api/user/ConfirmRegister',
				qs.stringify({ email, code })
			);
			return {
				succeeded,
				errors
			};
		} catch (ex) {
			throw new Error(ex);
		}
	}
}

const auth = new Auth();
export default auth;
