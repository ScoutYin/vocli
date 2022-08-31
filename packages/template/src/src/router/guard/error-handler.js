export const createErrorHandler = (router) => {
	router.onError((error) => {
		if (
			error.message.match(
				/(Failed to load module script|Failed to fetch dynamically imported module)/g
			)
		) {
			location.reload(true);
		}
	});
};
