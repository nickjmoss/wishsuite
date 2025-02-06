import React from 'react';
import { createContext, useContext } from 'react';
import UserStoreModel from './user.store';
import { addMiddleware } from 'mobx-state-tree';
import errorHandling from './middleware';

// Instantiate stores here (so that in tests we are only instantiating once)
const UserStore = UserStoreModel.create({});

// Add middleware to instances
addMiddleware(UserStore, errorHandling);

// initial values
export const rootStore = {
	UserStore,
};

// Context
export const StoreContext = createContext(null);

// Hook
export function useStores() {
	return useContext(StoreContext);
}

export const ModelConnector = (WrappedComponent, models, isTestModel = false) => {
	return class extends React.Component {
		constructor(props) {
			super(props);
			const modelProps = {};
			for (const modelName in models) {
				if (Object.hasOwnProperty.call(models, modelName)) {
					const modelObject = models[modelName];
					if (isTestModel) {
						modelProps[modelName] = modelObject;
					}
					else {
						modelProps[modelName] = createNewModelWithProps(modelObject, props);
					}
				}
			}
			this.modelProps = modelProps;
		}

		shouldComponentUpdate(nextProps) {
			for (const model in this.modelProps) {
				this.modelProps[model].updateProps(nextProps);
			}
			return true;
		}
		componentWillUnmount() {
			// for (const model in this.modelProps) {
			// 	// make sure the state tree is cleaned up to prevent memory leaks when component unmounts
			// 	destroy(this.modelProps[model]);
			// }
		}
		render() {
			return (
				<WrappedComponent {...this.modelProps} {...this.props} />
			);
		}
	};
};

function createNewModelWithProps(modelObject, props) { // this is necessary for the models to get updated props
	const { model, initialValues = {}, stores = {} } = modelObject;
	const newModel = model
		.volatile(() => ({
			props,
		}))
		.actions(self => ({
			updateProps(nextProps) {
				self.props = nextProps;
			},
		}));
	const initiatedModel = newModel.create(initialValues, stores);
	addMiddleware(initiatedModel, errorHandling);
	return initiatedModel;
}
