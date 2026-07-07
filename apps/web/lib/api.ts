export async function api<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Something went wrong",
    );
  }

  return data;
}
