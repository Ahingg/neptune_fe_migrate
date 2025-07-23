function createCasePdfFileUrl(caseUrl: string): string {
    return `${import.meta.env.VITE_API_BASE_URL}${caseUrl}`;
}

export { createCasePdfFileUrl };
