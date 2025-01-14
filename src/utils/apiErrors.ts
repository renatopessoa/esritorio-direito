interface ErrorMessages {
  [key: number]: string;
  default: string;
}

export function handleApiError(error: any, messages: ErrorMessages): Error {
  if (error.response?.status && messages[error.response.status]) {
    return new Error(messages[error.response.status]);
  }
  
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  
  return new Error(messages.default);
}