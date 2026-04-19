/** Map JWT payload (ASP.NET claim types) or login API body to a single user shape */
const CLAIM = {
  nameId: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
};

export function normalizeUser(tokenPayload, loginPayload) {
  if (loginPayload && (loginPayload.fullName != null || loginPayload.email)) {
    return {
      id: loginPayload.id,
      email: loginPayload.email,
      fullName: loginPayload.fullName,
      role: loginPayload.role || 'Applicant',
    };
  }
  if (!tokenPayload) return null;
  const id = tokenPayload[CLAIM.nameId] ?? tokenPayload.sub;
  const email = tokenPayload[CLAIM.email] ?? tokenPayload.email;
  const fullName = tokenPayload[CLAIM.name] ?? tokenPayload.name;
  const role = tokenPayload[CLAIM.role] ?? tokenPayload.role ?? 'Applicant';
  return {
    id: id != null ? Number(id) : undefined,
    email,
    fullName,
    role,
  };
}

export function isAdminRole(role) {
  return role === 'Admin';
}
