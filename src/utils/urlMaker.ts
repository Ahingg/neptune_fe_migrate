function createCasePdfFileUrl(caseUrl: string): string {
    return `${import.meta.env.VITE_BASE_API_URL}${caseUrl}`;
}

export { createCasePdfFileUrl };
