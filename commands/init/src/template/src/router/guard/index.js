import { createPermissionGuard } from './permission';
import { createErrorHandler } from './error-handler';

export const setupRouterGuard = (router) => {
	createPermissionGuard(router);
	createErrorHandler(router);
};
