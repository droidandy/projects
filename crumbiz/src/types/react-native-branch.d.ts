/* tslint:disable */
// TODO - replace the type.d file
declare module 'react-native-branch' {
	type MediaQueryList = any;
	type MediaQueryListEvent = any;
	type BranchEvent = any;
	interface IBranchUniversalObjectCreationOptions {
		canonicalIdentifier: string;
		title?: string;
		canonicalUrl?: string;
		contentDescription?: string;
		contentImageUrl?: string;
		locallyIndex?: boolean;
		publiclyIndex?: boolean;
		contentIndexingMode?: 'private' | 'public';
		currency?: string;
		price?: string;
		/**
		 * format: yyyy-MM-dd'T'HH:mm:ss
		 */
		expirationDate?: string;
		keywords?: string[];
		metadata?: any;
		type?: string;
		contentMetadata?: {
			contentSchema?: string;
			quantity?: number;
			price?: number;
			currency?: string;
			sku?: string;
			productName?: string;
			productBrand?: string;
			productCategory?: string;
			productVariant?: string;
			condition?: string;
			ratingAverage?: number;
			ratingCount?: number;
			ratingMax?: number;
			addressStreet?: string;
			addressCity?: string;
			addressRegion?: string;
			addressCountry?: string;
			addressPostalCode?: string;
			latitude?: number;
			longitude?: number;
			imageCaptions?: string;
			customMetadata?: any;
		};
	}

	export interface IBranchLinkInfo {
		$canonical_identifier: string;
		$canonical_url: string;
		$desktop_url: string;
		$exp_date: number;
		$identity_id: string;
		$og_description: string;
		$og_image_url: string;
		$og_title: string;
		$one_time_use: boolean;
		$publicly_indexable: string;
		'+click_timestamp': number;
		'+clicked_branch_link': boolean;
		'+is_first_session': boolean;
		'+match_guaranteed': boolean;
		'~campaign': string;
		'~channel': string;
		'~creation_source': number;
		'~feature': string;
		'~id': string;
		'~referring_link': string;
		'~stage': string;
		'~tags': string[];
	}

	export interface IBranchLinkProperties {
		feature: string;
		channel: string;
	}

	export interface IBranchControlParams {
		$desktop_url?: string;
		$ios_url?: string;
	}

	export interface IBranchShareOptions {
		messageHeader: string;
		messageBody: string;
	}

	export interface IBranchUniversalObject {
		ident: string;
		generateShortUrl: (
			linkProperties: IBranchLinkProperties,
			controlParams: IBranchControlParams
		) => Promise<{ url: string }>;
		showShareSheet: (
			shareOptions: IBranchShareOptions,
			linkProperties: IBranchLinkProperties,
			controlParams: IBranchControlParams
		) => Promise<{ channel: any; completed: any; error: any }>;
		listOnSpotlight: () => any;
		logEvent: (eventName: string) => any;
		registerView: (ident: string) => Promise<void>;
		release: () => void;
		userCompletedAction: (event: any) => any;
		_newIdent: () => any;
		_tryFunction: (func: any) => any;
	}

	class Branch {
		key: any;
		_checkCachedEvents: any;
		_debug: any;

		constructor(options: { debug?: boolean });

		subscribe(
			listener: (params: { error: any; params: any }) => void
		): () => void;

		skipCachedEvents(): void;

		_addListener(
			listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any
		): void;

		_removeListener(
			listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any
		): void;

		/*** Tracking related methods ***/
		disableTracking(disable: boolean): void;

		isTrackingDisabled(): Promise<boolean>;

		/*** RNBranch singleton methods ***/
		getLatestReferringParams(): Promise<IBranchLinkInfo>;

		getFirstReferringParams(): Promise<IBranchLinkInfo>;

		setIdentity(identity: string): void;

		logout(): void;

		userCompletedAction(event: string, state: any): void;

		getShortUrl(
			ident: string,
			linkPropertiesMap: any,
			controlParamsMap: any
		): Promise<{ url: string }>;

		sendCommerceEvent(revenue: string, metadata: any): Promise<void>;

		/*** Referral Methods ***/
		redeemRewards(
			amount: number,
			bucket: string
		): Promise<{ changed: boolean }>;

		loadRewards(bucket: string): Promise<{ credits: number }>;

		getCreditHistory(): Promise<any>;

		/*** BranchUniversalObject ***/
		createBranchUniversalObject(
			identifier: string,
			options: IBranchUniversalObjectCreationOptions
		): Promise<IBranchUniversalObject>;
	}

	export { Branch, BranchEvent };
	// noinspection JSUnusedGlobalSymbols
	// @ts-ignore
	export function skipCachedEvents() {

	}

	// @ts-ignore
	export function subscribe(param: ({ error, params }: { error: any; params: any }) => void) {

	}
}
