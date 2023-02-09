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
