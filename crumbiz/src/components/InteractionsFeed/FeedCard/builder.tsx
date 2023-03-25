import React from 'react';
import BaseHeader from './headers/BaseHeader';
import { IVInteraction } from '../../../types/interfaces';
import BaseBody from './bodies/BaseBody';
import merge from 'lodash.merge';
import { DefaultTheme } from 'styled-components';
import BaseFooter from './footers/BaseFooter';

interface IStructureComponents {
	header?: React.ReactNode;
	body?: React.ReactNode;
	footer?: React.ReactNode;
}

interface IStructureOptions {
	components?: IStructureComponents;
	getStyles?: Function;
}

const defaultComponents = {
	header: BaseHeader,
	body: BaseBody,
	footer: BaseFooter
};

const getDefaultStyles = (theme: DefaultTheme) => ({
	container: {
		colors: ['white', 'white'],
		backgroundColor: theme.colors.mainBackgroundColor
	},
	header: {},
	body: {
		backgroundColor: 'transparent'
	},
	footer: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 's11'
	}
});

export class StructureBuilder {
	header: React.FC<any>;
	body: React.FC<any>;
	footer: React.FC<any>;
	getCustomStyles: Function;

	constructor(options: IStructureOptions = {}) {
		const { components, getStyles } = options;
		const structure = merge({}, defaultComponents, components);

		const { header, body, footer } = structure;
		this.header = header;
		this.body = body;
		this.footer = footer;
		this.getCustomStyles = getStyles || getDefaultStyles;
	}

	getStyles = (theme: DefaultTheme) => {
		const { getCustomStyles } = this;

		return merge(getDefaultStyles(theme), getCustomStyles(theme));
	};

	makeComponent = (Component: React.FC, interaction: IVInteraction) => {
		return (props: any) => {
			return <Component interaction={interaction} {...props} />;
		};
	};

	build = (interaction: IVInteraction) => {
		const { header, body, footer } = this;
		return {
			header: this.makeComponent(header, interaction),
			body: this.makeComponent(body, interaction),
			footer: this.makeComponent(footer, interaction)
		};
	};
}
