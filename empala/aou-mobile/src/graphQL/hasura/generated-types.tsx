import { gql } from '@apollo/client';
import * as React from 'react';
import * as Apollo from '@apollo/client';
import * as ApolloReactComponents from '@apollo/client/react/components';
import * as ApolloReactHoc from '@apollo/client/react/hoc';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  bigint: any;
  date: any;
  numeric: any;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: Maybe<Scalars['String']>;
  _is_null?: Maybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: Maybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: Maybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: Maybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: Maybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: Maybe<Scalars['bigint']>;
  _gt?: Maybe<Scalars['bigint']>;
  _gte?: Maybe<Scalars['bigint']>;
  _in?: Maybe<Array<Scalars['bigint']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['bigint']>;
  _lte?: Maybe<Scalars['bigint']>;
  _neq?: Maybe<Scalars['bigint']>;
  _nin?: Maybe<Array<Scalars['bigint']>>;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: Maybe<Scalars['date']>;
  _gt?: Maybe<Scalars['date']>;
  _gte?: Maybe<Scalars['date']>;
  _in?: Maybe<Array<Scalars['date']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['date']>;
  _lte?: Maybe<Scalars['date']>;
  _neq?: Maybe<Scalars['date']>;
  _nin?: Maybe<Array<Scalars['date']>>;
};

/** columns and relationships of "instruments.feed" */
export type Instruments_Feed = {
  __typename?: 'instruments_feed';
  name: Scalars['String'];
};

/** aggregated selection of "instruments.feed" */
export type Instruments_Feed_Aggregate = {
  __typename?: 'instruments_feed_aggregate';
  aggregate?: Maybe<Instruments_Feed_Aggregate_Fields>;
  nodes: Array<Instruments_Feed>;
};

/** aggregate fields of "instruments.feed" */
export type Instruments_Feed_Aggregate_Fields = {
  __typename?: 'instruments_feed_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Instruments_Feed_Max_Fields>;
  min?: Maybe<Instruments_Feed_Min_Fields>;
};

/** aggregate fields of "instruments.feed" */
export type Instruments_Feed_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Instruments_Feed_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "instruments.feed". All fields are combined with a logical 'AND'. */
export type Instruments_Feed_Bool_Exp = {
  _and?: Maybe<Array<Instruments_Feed_Bool_Exp>>;
  _not?: Maybe<Instruments_Feed_Bool_Exp>;
  _or?: Maybe<Array<Instruments_Feed_Bool_Exp>>;
  name?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "instruments.feed" */
export enum Instruments_Feed_Constraint {
  /** unique or primary key constraint */
  PkeyFeedName = 'pkey_feed_name',
}

export enum Instruments_Feed_Enum {
  Apex = 'APEX',
  MorningStar = 'MORNING_STAR',
}

/** Boolean expression to compare columns of type "instruments_feed_enum". All fields are combined with logical 'AND'. */
export type Instruments_Feed_Enum_Comparison_Exp = {
  _eq?: Maybe<Instruments_Feed_Enum>;
  _in?: Maybe<Array<Instruments_Feed_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Instruments_Feed_Enum>;
  _nin?: Maybe<Array<Instruments_Feed_Enum>>;
};

/** input type for inserting data into table "instruments.feed" */
export type Instruments_Feed_Insert_Input = {
  name?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Instruments_Feed_Max_Fields = {
  __typename?: 'instruments_feed_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Instruments_Feed_Min_Fields = {
  __typename?: 'instruments_feed_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "instruments.feed" */
export type Instruments_Feed_Mutation_Response = {
  __typename?: 'instruments_feed_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Instruments_Feed>;
};

/** on conflict condition type for table "instruments.feed" */
export type Instruments_Feed_On_Conflict = {
  constraint: Instruments_Feed_Constraint;
  update_columns?: Array<Instruments_Feed_Update_Column>;
  where?: Maybe<Instruments_Feed_Bool_Exp>;
};

/** Ordering options when selecting data from "instruments.feed". */
export type Instruments_Feed_Order_By = {
  name?: Maybe<Order_By>;
};

/** primary key columns input for table: instruments_feed */
export type Instruments_Feed_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "instruments.feed" */
export enum Instruments_Feed_Select_Column {
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "instruments.feed" */
export type Instruments_Feed_Set_Input = {
  name?: Maybe<Scalars['String']>;
};

/** update columns of table "instruments.feed" */
export enum Instruments_Feed_Update_Column {
  /** column name */
  Name = 'name',
}

/** columns and relationships of "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily = {
  __typename?: 'marketdata_stock_prices_daily';
  feed: Instruments_Feed_Enum;
  inst_id: Scalars['bigint'];
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date: Scalars['date'];
};

/** aggregated selection of "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_Aggregate = {
  __typename?: 'marketdata_stock_prices_daily_aggregate';
  aggregate?: Maybe<Marketdata_Stock_Prices_Daily_Aggregate_Fields>;
  nodes: Array<Marketdata_Stock_Prices_Daily>;
};

/** aggregate fields of "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_Aggregate_Fields = {
  __typename?: 'marketdata_stock_prices_daily_aggregate_fields';
  avg?: Maybe<Marketdata_Stock_Prices_Daily_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Marketdata_Stock_Prices_Daily_Max_Fields>;
  min?: Maybe<Marketdata_Stock_Prices_Daily_Min_Fields>;
  stddev?: Maybe<Marketdata_Stock_Prices_Daily_Stddev_Fields>;
  stddev_pop?: Maybe<Marketdata_Stock_Prices_Daily_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Marketdata_Stock_Prices_Daily_Stddev_Samp_Fields>;
  sum?: Maybe<Marketdata_Stock_Prices_Daily_Sum_Fields>;
  var_pop?: Maybe<Marketdata_Stock_Prices_Daily_Var_Pop_Fields>;
  var_samp?: Maybe<Marketdata_Stock_Prices_Daily_Var_Samp_Fields>;
  variance?: Maybe<Marketdata_Stock_Prices_Daily_Variance_Fields>;
};

/** aggregate fields of "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Marketdata_Stock_Prices_Daily_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Marketdata_Stock_Prices_Daily_Avg_Fields = {
  __typename?: 'marketdata_stock_prices_daily_avg_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "marketdata.stock_prices_daily". All fields are combined with a logical 'AND'. */
export type Marketdata_Stock_Prices_Daily_Bool_Exp = {
  _and?: Maybe<Array<Marketdata_Stock_Prices_Daily_Bool_Exp>>;
  _not?: Maybe<Marketdata_Stock_Prices_Daily_Bool_Exp>;
  _or?: Maybe<Array<Marketdata_Stock_Prices_Daily_Bool_Exp>>;
  feed?: Maybe<Instruments_Feed_Enum_Comparison_Exp>;
  inst_id?: Maybe<Bigint_Comparison_Exp>;
  price_close?: Maybe<Numeric_Comparison_Exp>;
  price_high?: Maybe<Numeric_Comparison_Exp>;
  price_low?: Maybe<Numeric_Comparison_Exp>;
  price_open?: Maybe<Numeric_Comparison_Exp>;
  ts_date?: Maybe<Date_Comparison_Exp>;
};

/** unique or primary key constraints on table "marketdata.stock_prices_daily" */
export enum Marketdata_Stock_Prices_Daily_Constraint {
  /** unique or primary key constraint */
  PkeyStockPricesDailyTsDateInstIdFeed = 'pkey_stock_prices_daily_ts_date_inst_id_feed',
}

/** input type for incrementing numeric columns in table "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_Inc_Input = {
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
};

/** input type for inserting data into table "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_Insert_Input = {
  feed?: Maybe<Instruments_Feed_Enum>;
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate max on columns */
export type Marketdata_Stock_Prices_Daily_Max_Fields = {
  __typename?: 'marketdata_stock_prices_daily_max_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate min on columns */
export type Marketdata_Stock_Prices_Daily_Min_Fields = {
  __typename?: 'marketdata_stock_prices_daily_min_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** response of any mutation on the table "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_Mutation_Response = {
  __typename?: 'marketdata_stock_prices_daily_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Marketdata_Stock_Prices_Daily>;
};

/** on conflict condition type for table "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_On_Conflict = {
  constraint: Marketdata_Stock_Prices_Daily_Constraint;
  update_columns?: Array<Marketdata_Stock_Prices_Daily_Update_Column>;
  where?: Maybe<Marketdata_Stock_Prices_Daily_Bool_Exp>;
};

/** Ordering options when selecting data from "marketdata.stock_prices_daily". */
export type Marketdata_Stock_Prices_Daily_Order_By = {
  feed?: Maybe<Order_By>;
  inst_id?: Maybe<Order_By>;
  price_close?: Maybe<Order_By>;
  price_high?: Maybe<Order_By>;
  price_low?: Maybe<Order_By>;
  price_open?: Maybe<Order_By>;
  ts_date?: Maybe<Order_By>;
};

/** primary key columns input for table: marketdata_stock_prices_daily */
export type Marketdata_Stock_Prices_Daily_Pk_Columns_Input = {
  feed: Instruments_Feed_Enum;
  inst_id: Scalars['bigint'];
  ts_date: Scalars['date'];
};

/** select columns of table "marketdata.stock_prices_daily" */
export enum Marketdata_Stock_Prices_Daily_Select_Column {
  /** column name */
  Feed = 'feed',
  /** column name */
  InstId = 'inst_id',
  /** column name */
  PriceClose = 'price_close',
  /** column name */
  PriceHigh = 'price_high',
  /** column name */
  PriceLow = 'price_low',
  /** column name */
  PriceOpen = 'price_open',
  /** column name */
  TsDate = 'ts_date',
}

/** input type for updating data in table "marketdata.stock_prices_daily" */
export type Marketdata_Stock_Prices_Daily_Set_Input = {
  feed?: Maybe<Instruments_Feed_Enum>;
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate stddev on columns */
export type Marketdata_Stock_Prices_Daily_Stddev_Fields = {
  __typename?: 'marketdata_stock_prices_daily_stddev_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Marketdata_Stock_Prices_Daily_Stddev_Pop_Fields = {
  __typename?: 'marketdata_stock_prices_daily_stddev_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Marketdata_Stock_Prices_Daily_Stddev_Samp_Fields = {
  __typename?: 'marketdata_stock_prices_daily_stddev_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Marketdata_Stock_Prices_Daily_Sum_Fields = {
  __typename?: 'marketdata_stock_prices_daily_sum_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
};

/** update columns of table "marketdata.stock_prices_daily" */
export enum Marketdata_Stock_Prices_Daily_Update_Column {
  /** column name */
  Feed = 'feed',
  /** column name */
  InstId = 'inst_id',
  /** column name */
  PriceClose = 'price_close',
  /** column name */
  PriceHigh = 'price_high',
  /** column name */
  PriceLow = 'price_low',
  /** column name */
  PriceOpen = 'price_open',
  /** column name */
  TsDate = 'ts_date',
}

/** aggregate var_pop on columns */
export type Marketdata_Stock_Prices_Daily_Var_Pop_Fields = {
  __typename?: 'marketdata_stock_prices_daily_var_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Marketdata_Stock_Prices_Daily_Var_Samp_Fields = {
  __typename?: 'marketdata_stock_prices_daily_var_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Marketdata_Stock_Prices_Daily_Variance_Fields = {
  __typename?: 'marketdata_stock_prices_daily_variance_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily = {
  __typename?: 'marketdata_view_stock_prices_daily';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregated selection of "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily_Aggregate = {
  __typename?: 'marketdata_view_stock_prices_daily_aggregate';
  aggregate?: Maybe<Marketdata_View_Stock_Prices_Daily_Aggregate_Fields>;
  nodes: Array<Marketdata_View_Stock_Prices_Daily>;
};

/** aggregate fields of "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily_Aggregate_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_aggregate_fields';
  avg?: Maybe<Marketdata_View_Stock_Prices_Daily_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Marketdata_View_Stock_Prices_Daily_Max_Fields>;
  min?: Maybe<Marketdata_View_Stock_Prices_Daily_Min_Fields>;
  stddev?: Maybe<Marketdata_View_Stock_Prices_Daily_Stddev_Fields>;
  stddev_pop?: Maybe<Marketdata_View_Stock_Prices_Daily_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Marketdata_View_Stock_Prices_Daily_Stddev_Samp_Fields>;
  sum?: Maybe<Marketdata_View_Stock_Prices_Daily_Sum_Fields>;
  var_pop?: Maybe<Marketdata_View_Stock_Prices_Daily_Var_Pop_Fields>;
  var_samp?: Maybe<Marketdata_View_Stock_Prices_Daily_Var_Samp_Fields>;
  variance?: Maybe<Marketdata_View_Stock_Prices_Daily_Variance_Fields>;
};

/** aggregate fields of "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Marketdata_View_Stock_Prices_Daily_Avg_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_avg_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "marketdata.view_stock_prices_daily". All fields are combined with a logical 'AND'. */
export type Marketdata_View_Stock_Prices_Daily_Bool_Exp = {
  _and?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Bool_Exp>>;
  _not?: Maybe<Marketdata_View_Stock_Prices_Daily_Bool_Exp>;
  _or?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Bool_Exp>>;
  inst_id?: Maybe<Bigint_Comparison_Exp>;
  price_close?: Maybe<Numeric_Comparison_Exp>;
  price_high?: Maybe<Numeric_Comparison_Exp>;
  price_low?: Maybe<Numeric_Comparison_Exp>;
  price_open?: Maybe<Numeric_Comparison_Exp>;
  ts_date?: Maybe<Date_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily_Inc_Input = {
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
};

/** input type for inserting data into table "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily_Insert_Input = {
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate max on columns */
export type Marketdata_View_Stock_Prices_Daily_Max_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_max_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate min on columns */
export type Marketdata_View_Stock_Prices_Daily_Min_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_min_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** response of any mutation on the table "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily_Mutation_Response = {
  __typename?: 'marketdata_view_stock_prices_daily_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Marketdata_View_Stock_Prices_Daily>;
};

/** Ordering options when selecting data from "marketdata.view_stock_prices_daily". */
export type Marketdata_View_Stock_Prices_Daily_Order_By = {
  inst_id?: Maybe<Order_By>;
  price_close?: Maybe<Order_By>;
  price_high?: Maybe<Order_By>;
  price_low?: Maybe<Order_By>;
  price_open?: Maybe<Order_By>;
  ts_date?: Maybe<Order_By>;
};

/** select columns of table "marketdata.view_stock_prices_daily" */
export enum Marketdata_View_Stock_Prices_Daily_Select_Column {
  /** column name */
  InstId = 'inst_id',
  /** column name */
  PriceClose = 'price_close',
  /** column name */
  PriceHigh = 'price_high',
  /** column name */
  PriceLow = 'price_low',
  /** column name */
  PriceOpen = 'price_open',
  /** column name */
  TsDate = 'ts_date',
}

/** input type for updating data in table "marketdata.view_stock_prices_daily" */
export type Marketdata_View_Stock_Prices_Daily_Set_Input = {
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate stddev on columns */
export type Marketdata_View_Stock_Prices_Daily_Stddev_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_stddev_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Marketdata_View_Stock_Prices_Daily_Stddev_Pop_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_stddev_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Marketdata_View_Stock_Prices_Daily_Stddev_Samp_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_stddev_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Marketdata_View_Stock_Prices_Daily_Sum_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_sum_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
};

/** aggregate var_pop on columns */
export type Marketdata_View_Stock_Prices_Daily_Var_Pop_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_var_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Marketdata_View_Stock_Prices_Daily_Var_Samp_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_var_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Marketdata_View_Stock_Prices_Daily_Variance_Fields = {
  __typename?: 'marketdata_view_stock_prices_daily_variance_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "marketdata.view_stock_prices_monthly" */
export type Marketdata_View_Stock_Prices_Monthly = {
  __typename?: 'marketdata_view_stock_prices_monthly';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregated selection of "marketdata.view_stock_prices_monthly" */
export type Marketdata_View_Stock_Prices_Monthly_Aggregate = {
  __typename?: 'marketdata_view_stock_prices_monthly_aggregate';
  aggregate?: Maybe<Marketdata_View_Stock_Prices_Monthly_Aggregate_Fields>;
  nodes: Array<Marketdata_View_Stock_Prices_Monthly>;
};

/** aggregate fields of "marketdata.view_stock_prices_monthly" */
export type Marketdata_View_Stock_Prices_Monthly_Aggregate_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_aggregate_fields';
  avg?: Maybe<Marketdata_View_Stock_Prices_Monthly_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Marketdata_View_Stock_Prices_Monthly_Max_Fields>;
  min?: Maybe<Marketdata_View_Stock_Prices_Monthly_Min_Fields>;
  stddev?: Maybe<Marketdata_View_Stock_Prices_Monthly_Stddev_Fields>;
  stddev_pop?: Maybe<Marketdata_View_Stock_Prices_Monthly_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Marketdata_View_Stock_Prices_Monthly_Stddev_Samp_Fields>;
  sum?: Maybe<Marketdata_View_Stock_Prices_Monthly_Sum_Fields>;
  var_pop?: Maybe<Marketdata_View_Stock_Prices_Monthly_Var_Pop_Fields>;
  var_samp?: Maybe<Marketdata_View_Stock_Prices_Monthly_Var_Samp_Fields>;
  variance?: Maybe<Marketdata_View_Stock_Prices_Monthly_Variance_Fields>;
};

/** aggregate fields of "marketdata.view_stock_prices_monthly" */
export type Marketdata_View_Stock_Prices_Monthly_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Marketdata_View_Stock_Prices_Monthly_Avg_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_avg_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "marketdata.view_stock_prices_monthly". All fields are combined with a logical 'AND'. */
export type Marketdata_View_Stock_Prices_Monthly_Bool_Exp = {
  _and?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Bool_Exp>>;
  _not?: Maybe<Marketdata_View_Stock_Prices_Monthly_Bool_Exp>;
  _or?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Bool_Exp>>;
  inst_id?: Maybe<Bigint_Comparison_Exp>;
  price_close?: Maybe<Numeric_Comparison_Exp>;
  price_high?: Maybe<Numeric_Comparison_Exp>;
  price_low?: Maybe<Numeric_Comparison_Exp>;
  price_open?: Maybe<Numeric_Comparison_Exp>;
  ts_date?: Maybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Marketdata_View_Stock_Prices_Monthly_Max_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_max_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate min on columns */
export type Marketdata_View_Stock_Prices_Monthly_Min_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_min_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** Ordering options when selecting data from "marketdata.view_stock_prices_monthly". */
export type Marketdata_View_Stock_Prices_Monthly_Order_By = {
  inst_id?: Maybe<Order_By>;
  price_close?: Maybe<Order_By>;
  price_high?: Maybe<Order_By>;
  price_low?: Maybe<Order_By>;
  price_open?: Maybe<Order_By>;
  ts_date?: Maybe<Order_By>;
};

/** select columns of table "marketdata.view_stock_prices_monthly" */
export enum Marketdata_View_Stock_Prices_Monthly_Select_Column {
  /** column name */
  InstId = 'inst_id',
  /** column name */
  PriceClose = 'price_close',
  /** column name */
  PriceHigh = 'price_high',
  /** column name */
  PriceLow = 'price_low',
  /** column name */
  PriceOpen = 'price_open',
  /** column name */
  TsDate = 'ts_date',
}

/** aggregate stddev on columns */
export type Marketdata_View_Stock_Prices_Monthly_Stddev_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_stddev_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Marketdata_View_Stock_Prices_Monthly_Stddev_Pop_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_stddev_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Marketdata_View_Stock_Prices_Monthly_Stddev_Samp_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_stddev_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Marketdata_View_Stock_Prices_Monthly_Sum_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_sum_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
};

/** aggregate var_pop on columns */
export type Marketdata_View_Stock_Prices_Monthly_Var_Pop_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_var_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Marketdata_View_Stock_Prices_Monthly_Var_Samp_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_var_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Marketdata_View_Stock_Prices_Monthly_Variance_Fields = {
  __typename?: 'marketdata_view_stock_prices_monthly_variance_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "marketdata.view_stock_prices_weekly" */
export type Marketdata_View_Stock_Prices_Weekly = {
  __typename?: 'marketdata_view_stock_prices_weekly';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregated selection of "marketdata.view_stock_prices_weekly" */
export type Marketdata_View_Stock_Prices_Weekly_Aggregate = {
  __typename?: 'marketdata_view_stock_prices_weekly_aggregate';
  aggregate?: Maybe<Marketdata_View_Stock_Prices_Weekly_Aggregate_Fields>;
  nodes: Array<Marketdata_View_Stock_Prices_Weekly>;
};

/** aggregate fields of "marketdata.view_stock_prices_weekly" */
export type Marketdata_View_Stock_Prices_Weekly_Aggregate_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_aggregate_fields';
  avg?: Maybe<Marketdata_View_Stock_Prices_Weekly_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Marketdata_View_Stock_Prices_Weekly_Max_Fields>;
  min?: Maybe<Marketdata_View_Stock_Prices_Weekly_Min_Fields>;
  stddev?: Maybe<Marketdata_View_Stock_Prices_Weekly_Stddev_Fields>;
  stddev_pop?: Maybe<Marketdata_View_Stock_Prices_Weekly_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Marketdata_View_Stock_Prices_Weekly_Stddev_Samp_Fields>;
  sum?: Maybe<Marketdata_View_Stock_Prices_Weekly_Sum_Fields>;
  var_pop?: Maybe<Marketdata_View_Stock_Prices_Weekly_Var_Pop_Fields>;
  var_samp?: Maybe<Marketdata_View_Stock_Prices_Weekly_Var_Samp_Fields>;
  variance?: Maybe<Marketdata_View_Stock_Prices_Weekly_Variance_Fields>;
};

/** aggregate fields of "marketdata.view_stock_prices_weekly" */
export type Marketdata_View_Stock_Prices_Weekly_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Marketdata_View_Stock_Prices_Weekly_Avg_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_avg_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "marketdata.view_stock_prices_weekly". All fields are combined with a logical 'AND'. */
export type Marketdata_View_Stock_Prices_Weekly_Bool_Exp = {
  _and?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Bool_Exp>>;
  _not?: Maybe<Marketdata_View_Stock_Prices_Weekly_Bool_Exp>;
  _or?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Bool_Exp>>;
  inst_id?: Maybe<Bigint_Comparison_Exp>;
  price_close?: Maybe<Numeric_Comparison_Exp>;
  price_high?: Maybe<Numeric_Comparison_Exp>;
  price_low?: Maybe<Numeric_Comparison_Exp>;
  price_open?: Maybe<Numeric_Comparison_Exp>;
  ts_date?: Maybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Marketdata_View_Stock_Prices_Weekly_Max_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_max_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** aggregate min on columns */
export type Marketdata_View_Stock_Prices_Weekly_Min_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_min_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
  ts_date?: Maybe<Scalars['date']>;
};

/** Ordering options when selecting data from "marketdata.view_stock_prices_weekly". */
export type Marketdata_View_Stock_Prices_Weekly_Order_By = {
  inst_id?: Maybe<Order_By>;
  price_close?: Maybe<Order_By>;
  price_high?: Maybe<Order_By>;
  price_low?: Maybe<Order_By>;
  price_open?: Maybe<Order_By>;
  ts_date?: Maybe<Order_By>;
};

/** select columns of table "marketdata.view_stock_prices_weekly" */
export enum Marketdata_View_Stock_Prices_Weekly_Select_Column {
  /** column name */
  InstId = 'inst_id',
  /** column name */
  PriceClose = 'price_close',
  /** column name */
  PriceHigh = 'price_high',
  /** column name */
  PriceLow = 'price_low',
  /** column name */
  PriceOpen = 'price_open',
  /** column name */
  TsDate = 'ts_date',
}

/** aggregate stddev on columns */
export type Marketdata_View_Stock_Prices_Weekly_Stddev_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_stddev_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Marketdata_View_Stock_Prices_Weekly_Stddev_Pop_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_stddev_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Marketdata_View_Stock_Prices_Weekly_Stddev_Samp_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_stddev_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Marketdata_View_Stock_Prices_Weekly_Sum_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_sum_fields';
  inst_id?: Maybe<Scalars['bigint']>;
  price_close?: Maybe<Scalars['numeric']>;
  price_high?: Maybe<Scalars['numeric']>;
  price_low?: Maybe<Scalars['numeric']>;
  price_open?: Maybe<Scalars['numeric']>;
};

/** aggregate var_pop on columns */
export type Marketdata_View_Stock_Prices_Weekly_Var_Pop_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_var_pop_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Marketdata_View_Stock_Prices_Weekly_Var_Samp_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_var_samp_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Marketdata_View_Stock_Prices_Weekly_Variance_Fields = {
  __typename?: 'marketdata_view_stock_prices_weekly_variance_fields';
  inst_id?: Maybe<Scalars['Float']>;
  price_close?: Maybe<Scalars['Float']>;
  price_high?: Maybe<Scalars['Float']>;
  price_low?: Maybe<Scalars['Float']>;
  price_open?: Maybe<Scalars['Float']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "instruments.feed" */
  delete_instruments_feed?: Maybe<Instruments_Feed_Mutation_Response>;
  /** delete single row from the table: "instruments.feed" */
  delete_instruments_feed_by_pk?: Maybe<Instruments_Feed>;
  /** delete data from the table: "marketdata.stock_prices_daily" */
  delete_marketdata_stock_prices_daily?: Maybe<Marketdata_Stock_Prices_Daily_Mutation_Response>;
  /** delete single row from the table: "marketdata.stock_prices_daily" */
  delete_marketdata_stock_prices_daily_by_pk?: Maybe<Marketdata_Stock_Prices_Daily>;
  /** delete data from the table: "marketdata.view_stock_prices_daily" */
  delete_marketdata_view_stock_prices_daily?: Maybe<Marketdata_View_Stock_Prices_Daily_Mutation_Response>;
  /** insert data into the table: "instruments.feed" */
  insert_instruments_feed?: Maybe<Instruments_Feed_Mutation_Response>;
  /** insert a single row into the table: "instruments.feed" */
  insert_instruments_feed_one?: Maybe<Instruments_Feed>;
  /** insert data into the table: "marketdata.stock_prices_daily" */
  insert_marketdata_stock_prices_daily?: Maybe<Marketdata_Stock_Prices_Daily_Mutation_Response>;
  /** insert a single row into the table: "marketdata.stock_prices_daily" */
  insert_marketdata_stock_prices_daily_one?: Maybe<Marketdata_Stock_Prices_Daily>;
  /** insert data into the table: "marketdata.view_stock_prices_daily" */
  insert_marketdata_view_stock_prices_daily?: Maybe<Marketdata_View_Stock_Prices_Daily_Mutation_Response>;
  /** insert a single row into the table: "marketdata.view_stock_prices_daily" */
  insert_marketdata_view_stock_prices_daily_one?: Maybe<Marketdata_View_Stock_Prices_Daily>;
  /** update data of the table: "instruments.feed" */
  update_instruments_feed?: Maybe<Instruments_Feed_Mutation_Response>;
  /** update single row of the table: "instruments.feed" */
  update_instruments_feed_by_pk?: Maybe<Instruments_Feed>;
  /** update data of the table: "marketdata.stock_prices_daily" */
  update_marketdata_stock_prices_daily?: Maybe<Marketdata_Stock_Prices_Daily_Mutation_Response>;
  /** update single row of the table: "marketdata.stock_prices_daily" */
  update_marketdata_stock_prices_daily_by_pk?: Maybe<Marketdata_Stock_Prices_Daily>;
  /** update data of the table: "marketdata.view_stock_prices_daily" */
  update_marketdata_view_stock_prices_daily?: Maybe<Marketdata_View_Stock_Prices_Daily_Mutation_Response>;
};

/** mutation root */
export type Mutation_RootDelete_Instruments_FeedArgs = {
  where: Instruments_Feed_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Instruments_Feed_By_PkArgs = {
  name: Scalars['String'];
};

/** mutation root */
export type Mutation_RootDelete_Marketdata_Stock_Prices_DailyArgs = {
  where: Marketdata_Stock_Prices_Daily_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Marketdata_Stock_Prices_Daily_By_PkArgs = {
  feed: Instruments_Feed_Enum;
  inst_id: Scalars['bigint'];
  ts_date: Scalars['date'];
};

/** mutation root */
export type Mutation_RootDelete_Marketdata_View_Stock_Prices_DailyArgs = {
  where: Marketdata_View_Stock_Prices_Daily_Bool_Exp;
};

/** mutation root */
export type Mutation_RootInsert_Instruments_FeedArgs = {
  objects: Array<Instruments_Feed_Insert_Input>;
  on_conflict?: Maybe<Instruments_Feed_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Instruments_Feed_OneArgs = {
  object: Instruments_Feed_Insert_Input;
  on_conflict?: Maybe<Instruments_Feed_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Marketdata_Stock_Prices_DailyArgs = {
  objects: Array<Marketdata_Stock_Prices_Daily_Insert_Input>;
  on_conflict?: Maybe<Marketdata_Stock_Prices_Daily_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Marketdata_Stock_Prices_Daily_OneArgs = {
  object: Marketdata_Stock_Prices_Daily_Insert_Input;
  on_conflict?: Maybe<Marketdata_Stock_Prices_Daily_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Marketdata_View_Stock_Prices_DailyArgs = {
  objects: Array<Marketdata_View_Stock_Prices_Daily_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Marketdata_View_Stock_Prices_Daily_OneArgs = {
  object: Marketdata_View_Stock_Prices_Daily_Insert_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Instruments_FeedArgs = {
  _set?: Maybe<Instruments_Feed_Set_Input>;
  where: Instruments_Feed_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Instruments_Feed_By_PkArgs = {
  _set?: Maybe<Instruments_Feed_Set_Input>;
  pk_columns: Instruments_Feed_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Marketdata_Stock_Prices_DailyArgs = {
  _inc?: Maybe<Marketdata_Stock_Prices_Daily_Inc_Input>;
  _set?: Maybe<Marketdata_Stock_Prices_Daily_Set_Input>;
  where: Marketdata_Stock_Prices_Daily_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Marketdata_Stock_Prices_Daily_By_PkArgs = {
  _inc?: Maybe<Marketdata_Stock_Prices_Daily_Inc_Input>;
  _set?: Maybe<Marketdata_Stock_Prices_Daily_Set_Input>;
  pk_columns: Marketdata_Stock_Prices_Daily_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Marketdata_View_Stock_Prices_DailyArgs = {
  _inc?: Maybe<Marketdata_View_Stock_Prices_Daily_Inc_Input>;
  _set?: Maybe<Marketdata_View_Stock_Prices_Daily_Set_Input>;
  where: Marketdata_View_Stock_Prices_Daily_Bool_Exp;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: Maybe<Scalars['numeric']>;
  _gt?: Maybe<Scalars['numeric']>;
  _gte?: Maybe<Scalars['numeric']>;
  _in?: Maybe<Array<Scalars['numeric']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['numeric']>;
  _lte?: Maybe<Scalars['numeric']>;
  _neq?: Maybe<Scalars['numeric']>;
  _nin?: Maybe<Array<Scalars['numeric']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "instruments.feed" */
  instruments_feed: Array<Instruments_Feed>;
  /** fetch aggregated fields from the table: "instruments.feed" */
  instruments_feed_aggregate: Instruments_Feed_Aggregate;
  /** fetch data from the table: "instruments.feed" using primary key columns */
  instruments_feed_by_pk?: Maybe<Instruments_Feed>;
  /** fetch data from the table: "marketdata.stock_prices_daily" */
  marketdata_stock_prices_daily: Array<Marketdata_Stock_Prices_Daily>;
  /** fetch aggregated fields from the table: "marketdata.stock_prices_daily" */
  marketdata_stock_prices_daily_aggregate: Marketdata_Stock_Prices_Daily_Aggregate;
  /** fetch data from the table: "marketdata.stock_prices_daily" using primary key columns */
  marketdata_stock_prices_daily_by_pk?: Maybe<Marketdata_Stock_Prices_Daily>;
  /** fetch data from the table: "marketdata.view_stock_prices_daily" */
  marketdata_view_stock_prices_daily: Array<Marketdata_View_Stock_Prices_Daily>;
  /** fetch aggregated fields from the table: "marketdata.view_stock_prices_daily" */
  marketdata_view_stock_prices_daily_aggregate: Marketdata_View_Stock_Prices_Daily_Aggregate;
  /** fetch data from the table: "marketdata.view_stock_prices_monthly" */
  marketdata_view_stock_prices_monthly: Array<Marketdata_View_Stock_Prices_Monthly>;
  /** fetch aggregated fields from the table: "marketdata.view_stock_prices_monthly" */
  marketdata_view_stock_prices_monthly_aggregate: Marketdata_View_Stock_Prices_Monthly_Aggregate;
  /** fetch data from the table: "marketdata.view_stock_prices_weekly" */
  marketdata_view_stock_prices_weekly: Array<Marketdata_View_Stock_Prices_Weekly>;
  /** fetch aggregated fields from the table: "marketdata.view_stock_prices_weekly" */
  marketdata_view_stock_prices_weekly_aggregate: Marketdata_View_Stock_Prices_Weekly_Aggregate;
};

export type Query_RootInstruments_FeedArgs = {
  distinct_on?: Maybe<Array<Instruments_Feed_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Instruments_Feed_Order_By>>;
  where?: Maybe<Instruments_Feed_Bool_Exp>;
};

export type Query_RootInstruments_Feed_AggregateArgs = {
  distinct_on?: Maybe<Array<Instruments_Feed_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Instruments_Feed_Order_By>>;
  where?: Maybe<Instruments_Feed_Bool_Exp>;
};

export type Query_RootInstruments_Feed_By_PkArgs = {
  name: Scalars['String'];
};

export type Query_RootMarketdata_Stock_Prices_DailyArgs = {
  distinct_on?: Maybe<Array<Marketdata_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_Stock_Prices_Daily_Bool_Exp>;
};

export type Query_RootMarketdata_Stock_Prices_Daily_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_Stock_Prices_Daily_Bool_Exp>;
};

export type Query_RootMarketdata_Stock_Prices_Daily_By_PkArgs = {
  feed: Instruments_Feed_Enum;
  inst_id: Scalars['bigint'];
  ts_date: Scalars['date'];
};

export type Query_RootMarketdata_View_Stock_Prices_DailyArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Daily_Bool_Exp>;
};

export type Query_RootMarketdata_View_Stock_Prices_Daily_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Daily_Bool_Exp>;
};

export type Query_RootMarketdata_View_Stock_Prices_MonthlyArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Monthly_Bool_Exp>;
};

export type Query_RootMarketdata_View_Stock_Prices_Monthly_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Monthly_Bool_Exp>;
};

export type Query_RootMarketdata_View_Stock_Prices_WeeklyArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Weekly_Bool_Exp>;
};

export type Query_RootMarketdata_View_Stock_Prices_Weekly_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Weekly_Bool_Exp>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "instruments.feed" */
  instruments_feed: Array<Instruments_Feed>;
  /** fetch aggregated fields from the table: "instruments.feed" */
  instruments_feed_aggregate: Instruments_Feed_Aggregate;
  /** fetch data from the table: "instruments.feed" using primary key columns */
  instruments_feed_by_pk?: Maybe<Instruments_Feed>;
  /** fetch data from the table: "marketdata.stock_prices_daily" */
  marketdata_stock_prices_daily: Array<Marketdata_Stock_Prices_Daily>;
  /** fetch aggregated fields from the table: "marketdata.stock_prices_daily" */
  marketdata_stock_prices_daily_aggregate: Marketdata_Stock_Prices_Daily_Aggregate;
  /** fetch data from the table: "marketdata.stock_prices_daily" using primary key columns */
  marketdata_stock_prices_daily_by_pk?: Maybe<Marketdata_Stock_Prices_Daily>;
  /** fetch data from the table: "marketdata.view_stock_prices_daily" */
  marketdata_view_stock_prices_daily: Array<Marketdata_View_Stock_Prices_Daily>;
  /** fetch aggregated fields from the table: "marketdata.view_stock_prices_daily" */
  marketdata_view_stock_prices_daily_aggregate: Marketdata_View_Stock_Prices_Daily_Aggregate;
  /** fetch data from the table: "marketdata.view_stock_prices_monthly" */
  marketdata_view_stock_prices_monthly: Array<Marketdata_View_Stock_Prices_Monthly>;
  /** fetch aggregated fields from the table: "marketdata.view_stock_prices_monthly" */
  marketdata_view_stock_prices_monthly_aggregate: Marketdata_View_Stock_Prices_Monthly_Aggregate;
  /** fetch data from the table: "marketdata.view_stock_prices_weekly" */
  marketdata_view_stock_prices_weekly: Array<Marketdata_View_Stock_Prices_Weekly>;
  /** fetch aggregated fields from the table: "marketdata.view_stock_prices_weekly" */
  marketdata_view_stock_prices_weekly_aggregate: Marketdata_View_Stock_Prices_Weekly_Aggregate;
};

export type Subscription_RootInstruments_FeedArgs = {
  distinct_on?: Maybe<Array<Instruments_Feed_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Instruments_Feed_Order_By>>;
  where?: Maybe<Instruments_Feed_Bool_Exp>;
};

export type Subscription_RootInstruments_Feed_AggregateArgs = {
  distinct_on?: Maybe<Array<Instruments_Feed_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Instruments_Feed_Order_By>>;
  where?: Maybe<Instruments_Feed_Bool_Exp>;
};

export type Subscription_RootInstruments_Feed_By_PkArgs = {
  name: Scalars['String'];
};

export type Subscription_RootMarketdata_Stock_Prices_DailyArgs = {
  distinct_on?: Maybe<Array<Marketdata_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_Stock_Prices_Daily_Bool_Exp>;
};

export type Subscription_RootMarketdata_Stock_Prices_Daily_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_Stock_Prices_Daily_Bool_Exp>;
};

export type Subscription_RootMarketdata_Stock_Prices_Daily_By_PkArgs = {
  feed: Instruments_Feed_Enum;
  inst_id: Scalars['bigint'];
  ts_date: Scalars['date'];
};

export type Subscription_RootMarketdata_View_Stock_Prices_DailyArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Daily_Bool_Exp>;
};

export type Subscription_RootMarketdata_View_Stock_Prices_Daily_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Daily_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Daily_Bool_Exp>;
};

export type Subscription_RootMarketdata_View_Stock_Prices_MonthlyArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Monthly_Bool_Exp>;
};

export type Subscription_RootMarketdata_View_Stock_Prices_Monthly_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Monthly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Monthly_Bool_Exp>;
};

export type Subscription_RootMarketdata_View_Stock_Prices_WeeklyArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Weekly_Bool_Exp>;
};

export type Subscription_RootMarketdata_View_Stock_Prices_Weekly_AggregateArgs = {
  distinct_on?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Marketdata_View_Stock_Prices_Weekly_Order_By>>;
  where?: Maybe<Marketdata_View_Stock_Prices_Weekly_Bool_Exp>;
};

export type StockPricesDailyQueryVariables = Exact<{
  companyId: Scalars['bigint'];
  from: Scalars['date'];
  to: Scalars['date'];
}>;

export type StockPricesDailyQuery = { __typename?: 'query_root' } & {
  marketdata_view_stock_prices_daily: Array<
    { __typename?: 'marketdata_view_stock_prices_daily' } & Pick<
      Marketdata_View_Stock_Prices_Daily,
      'inst_id' | 'price_close' | 'price_high' | 'price_low' | 'price_open' | 'ts_date'
    >
  >;
};

export type StockPricesMonthlyQueryVariables = Exact<{
  companyId: Scalars['bigint'];
  from: Scalars['date'];
  to: Scalars['date'];
}>;

export type StockPricesMonthlyQuery = { __typename?: 'query_root' } & {
  marketdata_view_stock_prices_monthly: Array<
    { __typename?: 'marketdata_view_stock_prices_monthly' } & Pick<
      Marketdata_View_Stock_Prices_Monthly,
      'inst_id' | 'price_close' | 'price_high' | 'price_low' | 'price_open' | 'ts_date'
    >
  >;
};

export type StockPricesWeeklyQueryVariables = Exact<{
  companyId: Scalars['bigint'];
  from: Scalars['date'];
  to: Scalars['date'];
}>;

export type StockPricesWeeklyQuery = { __typename?: 'query_root' } & {
  marketdata_view_stock_prices_weekly: Array<
    { __typename?: 'marketdata_view_stock_prices_weekly' } & Pick<
      Marketdata_View_Stock_Prices_Weekly,
      'inst_id' | 'price_close' | 'price_high' | 'price_low' | 'price_open' | 'ts_date'
    >
  >;
};

export type InstrumentsFeedQueryVariables = Exact<{ [key: string]: never }>;

export type InstrumentsFeedQuery = { __typename?: 'query_root' } & {
  instruments_feed: Array<{ __typename?: 'instruments_feed' } & Pick<Instruments_Feed, 'name'>>;
};

export const StockPricesDailyDocument = gql`
  query StockPricesDaily($companyId: bigint!, $from: date!, $to: date!) {
    marketdata_view_stock_prices_daily(
      where: { inst_id: { _eq: $companyId }, ts_date: { _gte: $from, _lte: $to } }
      order_by: { ts_date: asc }
    ) {
      inst_id
      price_close
      price_high
      price_low
      price_open
      ts_date
    }
  }
`;
export type StockPricesDailyComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<StockPricesDailyQuery, StockPricesDailyQueryVariables>,
  'query'
> &
  ({ variables: StockPricesDailyQueryVariables; skip?: boolean } | { skip: boolean });

export const StockPricesDailyComponent = (props: StockPricesDailyComponentProps) => (
  <ApolloReactComponents.Query<StockPricesDailyQuery, StockPricesDailyQueryVariables>
    query={StockPricesDailyDocument}
    {...props}
  />
);

export type StockPricesDailyProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<StockPricesDailyQuery, StockPricesDailyQueryVariables>;
} &
  TChildProps;
export function withStockPricesDaily<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    StockPricesDailyQuery,
    StockPricesDailyQueryVariables,
    StockPricesDailyProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    StockPricesDailyQuery,
    StockPricesDailyQueryVariables,
    StockPricesDailyProps<TChildProps, TDataName>
  >(StockPricesDailyDocument, {
    alias: 'stockPricesDaily',
    ...operationOptions,
  });
}

/**
 * __useStockPricesDailyQuery__
 *
 * To run a query within a React component, call `useStockPricesDailyQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockPricesDailyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockPricesDailyQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useStockPricesDailyQuery(
  baseOptions: Apollo.QueryHookOptions<StockPricesDailyQuery, StockPricesDailyQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<StockPricesDailyQuery, StockPricesDailyQueryVariables>(StockPricesDailyDocument, options);
}
export function useStockPricesDailyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<StockPricesDailyQuery, StockPricesDailyQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<StockPricesDailyQuery, StockPricesDailyQueryVariables>(StockPricesDailyDocument, options);
}
export type StockPricesDailyQueryHookResult = ReturnType<typeof useStockPricesDailyQuery>;
export type StockPricesDailyLazyQueryHookResult = ReturnType<typeof useStockPricesDailyLazyQuery>;
export type StockPricesDailyQueryResult = Apollo.QueryResult<StockPricesDailyQuery, StockPricesDailyQueryVariables>;
export const StockPricesMonthlyDocument = gql`
  query StockPricesMonthly($companyId: bigint!, $from: date!, $to: date!) {
    marketdata_view_stock_prices_monthly(
      where: { inst_id: { _eq: $companyId }, ts_date: { _gte: $from, _lte: $to } }
      order_by: { ts_date: asc }
    ) {
      inst_id
      price_close
      price_high
      price_low
      price_open
      ts_date
    }
  }
`;
export type StockPricesMonthlyComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<StockPricesMonthlyQuery, StockPricesMonthlyQueryVariables>,
  'query'
> &
  ({ variables: StockPricesMonthlyQueryVariables; skip?: boolean } | { skip: boolean });

export const StockPricesMonthlyComponent = (props: StockPricesMonthlyComponentProps) => (
  <ApolloReactComponents.Query<StockPricesMonthlyQuery, StockPricesMonthlyQueryVariables>
    query={StockPricesMonthlyDocument}
    {...props}
  />
);

export type StockPricesMonthlyProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<StockPricesMonthlyQuery, StockPricesMonthlyQueryVariables>;
} &
  TChildProps;
export function withStockPricesMonthly<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    StockPricesMonthlyQuery,
    StockPricesMonthlyQueryVariables,
    StockPricesMonthlyProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    StockPricesMonthlyQuery,
    StockPricesMonthlyQueryVariables,
    StockPricesMonthlyProps<TChildProps, TDataName>
  >(StockPricesMonthlyDocument, {
    alias: 'stockPricesMonthly',
    ...operationOptions,
  });
}

/**
 * __useStockPricesMonthlyQuery__
 *
 * To run a query within a React component, call `useStockPricesMonthlyQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockPricesMonthlyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockPricesMonthlyQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useStockPricesMonthlyQuery(
  baseOptions: Apollo.QueryHookOptions<StockPricesMonthlyQuery, StockPricesMonthlyQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<StockPricesMonthlyQuery, StockPricesMonthlyQueryVariables>(
    StockPricesMonthlyDocument,
    options,
  );
}
export function useStockPricesMonthlyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<StockPricesMonthlyQuery, StockPricesMonthlyQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<StockPricesMonthlyQuery, StockPricesMonthlyQueryVariables>(
    StockPricesMonthlyDocument,
    options,
  );
}
export type StockPricesMonthlyQueryHookResult = ReturnType<typeof useStockPricesMonthlyQuery>;
export type StockPricesMonthlyLazyQueryHookResult = ReturnType<typeof useStockPricesMonthlyLazyQuery>;
export type StockPricesMonthlyQueryResult = Apollo.QueryResult<
  StockPricesMonthlyQuery,
  StockPricesMonthlyQueryVariables
>;
export const StockPricesWeeklyDocument = gql`
  query StockPricesWeekly($companyId: bigint!, $from: date!, $to: date!) {
    marketdata_view_stock_prices_weekly(
      where: { inst_id: { _eq: $companyId }, ts_date: { _gte: $from, _lte: $to } }
      order_by: { ts_date: asc }
    ) {
      inst_id
      price_close
      price_high
      price_low
      price_open
      ts_date
    }
  }
`;
export type StockPricesWeeklyComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>,
  'query'
> &
  ({ variables: StockPricesWeeklyQueryVariables; skip?: boolean } | { skip: boolean });

export const StockPricesWeeklyComponent = (props: StockPricesWeeklyComponentProps) => (
  <ApolloReactComponents.Query<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>
    query={StockPricesWeeklyDocument}
    {...props}
  />
);

export type StockPricesWeeklyProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>;
} &
  TChildProps;
export function withStockPricesWeekly<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    StockPricesWeeklyQuery,
    StockPricesWeeklyQueryVariables,
    StockPricesWeeklyProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    StockPricesWeeklyQuery,
    StockPricesWeeklyQueryVariables,
    StockPricesWeeklyProps<TChildProps, TDataName>
  >(StockPricesWeeklyDocument, {
    alias: 'stockPricesWeekly',
    ...operationOptions,
  });
}

/**
 * __useStockPricesWeeklyQuery__
 *
 * To run a query within a React component, call `useStockPricesWeeklyQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockPricesWeeklyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockPricesWeeklyQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useStockPricesWeeklyQuery(
  baseOptions: Apollo.QueryHookOptions<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>(StockPricesWeeklyDocument, options);
}
export function useStockPricesWeeklyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>(
    StockPricesWeeklyDocument,
    options,
  );
}
export type StockPricesWeeklyQueryHookResult = ReturnType<typeof useStockPricesWeeklyQuery>;
export type StockPricesWeeklyLazyQueryHookResult = ReturnType<typeof useStockPricesWeeklyLazyQuery>;
export type StockPricesWeeklyQueryResult = Apollo.QueryResult<StockPricesWeeklyQuery, StockPricesWeeklyQueryVariables>;
export const InstrumentsFeedDocument = gql`
  query InstrumentsFeed {
    instruments_feed {
      name
    }
  }
`;
export type InstrumentsFeedComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>,
  'query'
>;

export const InstrumentsFeedComponent = (props: InstrumentsFeedComponentProps) => (
  <ApolloReactComponents.Query<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>
    query={InstrumentsFeedDocument}
    {...props}
  />
);

export type InstrumentsFeedProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>;
} &
  TChildProps;
export function withInstrumentsFeed<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    InstrumentsFeedQuery,
    InstrumentsFeedQueryVariables,
    InstrumentsFeedProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    InstrumentsFeedQuery,
    InstrumentsFeedQueryVariables,
    InstrumentsFeedProps<TChildProps, TDataName>
  >(InstrumentsFeedDocument, {
    alias: 'instrumentsFeed',
    ...operationOptions,
  });
}

/**
 * __useInstrumentsFeedQuery__
 *
 * To run a query within a React component, call `useInstrumentsFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstrumentsFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstrumentsFeedQuery({
 *   variables: {
 *   },
 * });
 */
export function useInstrumentsFeedQuery(
  baseOptions?: Apollo.QueryHookOptions<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>(InstrumentsFeedDocument, options);
}
export function useInstrumentsFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>(InstrumentsFeedDocument, options);
}
export type InstrumentsFeedQueryHookResult = ReturnType<typeof useInstrumentsFeedQuery>;
export type InstrumentsFeedLazyQueryHookResult = ReturnType<typeof useInstrumentsFeedLazyQuery>;
export type InstrumentsFeedQueryResult = Apollo.QueryResult<InstrumentsFeedQuery, InstrumentsFeedQueryVariables>;
