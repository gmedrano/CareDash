export const login = async (username: string, password: string): Promise<string> => {
    const response = await fetch(`/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data = await response.json();
    return data.access_token;
  };
  
  export const clearMessages = async (token:string) => {
    const response = await fetch(`/api/clear_memory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({})
    })
    return response
  } 
  
  