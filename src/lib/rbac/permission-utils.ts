/**
 * Build permission object from raw permission records.
 * Ensures no duplicate actions per resource.
 */
export function buildPermissionObject(
	permissions: Array<{ resource: string; action: string }>,
): Record<string, string[]> {
	return permissions.reduce<Record<string, string[]>>(
		(acc, { resource, action }) => {
			if (!acc[resource]) {
				acc[resource] = [];
			}
			if (!acc[resource].includes(action)) {
				acc[resource].push(action);
			}
			return acc;
		},
		{},
	);
}
