// Função para obter a URL base da API
export function getApiBaseUrl() {
  // Em produção, use a URL relativa
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // Em desenvolvimento, use a URL completa
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

// Função para fazer chamadas de API
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  // Adiciona headers padrão
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Adiciona credentials para garantir que os cookies sejam enviados
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include' as RequestCredentials,
  };
  
  console.log(`[API] Chamando ${url}`, fetchOptions);
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Se a resposta não for ok, tenta extrair o erro
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Erro na chamada ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error(`API error: ${response.status} ${errorText}`);
    }
    
    // Tenta fazer o parse do JSON
    try {
      return await response.json();
    } catch (e) {
      console.error(`[API] Erro ao fazer parse do JSON de ${url}:`, e);
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error(`[API] Erro na chamada ${url}:`, error);
    throw error;
  }
}

// Funções específicas para cada endpoint
export const api = {
  // Transações
  getTransactions: () => apiRequest('/transactions'),
  addTransaction: (data: any) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Categorias
  getCategories: () => apiRequest('/categories'),
  seedCategories: () => apiRequest('/seed', { method: 'POST' }),
  
  // Health check
  checkHealth: () => apiRequest('/health'),
}; 