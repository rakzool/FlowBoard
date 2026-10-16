import type { TContainer, TGrant, TUser } from "./types/common.types";

export function canAccessContainer(
  user: TUser | undefined,
  containerId: string,
  containers: TContainer[],
  grants: TGrant[],
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  const chain: TContainer[] = [];
  let current = containers.find((container) => container.id === containerId);
  while (current) {
    chain.unshift(current);
    current = current.parentId
      ? containers.find((container) => container.id === current?.parentId)
      : undefined;
  }
  if (!chain.length) return false;
  return chain.every((container) => {
    const resourceGrants = grants.filter(
      (grant) => grant.resourceId === container.id && grant.userId === user.id,
    );
    if (resourceGrants.some((grant) => grant.mode === "deny")) return false;
    if (container.visibility === "public") return true;
    return resourceGrants.some((grant) => grant.mode === "allow");
  });
}
