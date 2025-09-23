import apiClient from '@/api/client';

export const testEndpoints = async () => {
  const endpoints = [
    { name: 'Courses List', url: '/courses/', method: 'GET' },
    { name: 'User Profile', url: '/users/profile/', method: 'GET' },
    { name: 'Health Check', url: '/health/', method: 'GET' }
  ];

  console.log('🔍 Testing API endpoints...');
  console.log('Base URL:', apiClient.defaults.baseURL);
  
  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient({
        url: endpoint.url,
        method: endpoint.method
      });
      const result = {
        name: endpoint.name,
        status: '✅ SUCCESS',
        statusCode: response.status,
        data: response.data
      };
      results.push(result);
      console.log(`✅ ${endpoint.name}:`, response.status, response.data);
    } catch (error: any) {
      const result = {
        name: endpoint.name,
        status: '❌ ERROR',
        statusCode: error.response?.status,
        error: error.message
      };
      results.push(result);
      console.log(`❌ ${endpoint.name}:`, error.response?.status, error.message);
    }
  }

  return results;
};